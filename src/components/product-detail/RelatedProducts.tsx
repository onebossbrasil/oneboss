
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { supabase } from "@/integrations/supabase/client";
import { FormattedProduct } from "@/types/product";
import { useCategories } from "@/contexts/CategoryContext";

interface RelatedProductsProps {
  currentProductId: string;
  categoryId: string | null;
}

const RelatedProducts = ({ currentProductId, categoryId }: RelatedProductsProps) => {
  const [relatedProducts, setRelatedProducts] = useState<FormattedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { categories } = useCategories();

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setIsLoading(true);
        
        // Fetch products in the same category, excluding the current product
        const { data: productsData, error } = await supabase
          .from("products")
          .select(`
            id, 
            name, 
            price, 
            sale_price,
            category_id, 
            featured,
            published,
            short_description
          `)
          .eq("published", true)
          .eq(categoryId ? "category_id" : "featured", categoryId || true) // If no category, show featured products
          .neq("id", currentProductId)
          .order("featured", { ascending: false })
          .limit(8);
          
        if (error) {
          throw new Error(error.message);
        }

        // Fetch images for all products
        const productIds = productsData.map((p: any) => p.id);
        
        const { data: imagesData, error: imagesError } = await supabase
          .from("product_images")
          .select("*")
          .in("product_id", productIds)
          .order("sort_order");
          
        if (imagesError) {
          throw new Error(imagesError.message);
        }

        // Group images by product id
        const imagesByProduct: Record<string, string> = {};
        imagesData.forEach((image: any) => {
          if (!imagesByProduct[image.product_id]) {
            imagesByProduct[image.product_id] = image.url;
          }
        });

        // Format the products with their first image
        const formattedProducts: FormattedProduct[] = productsData.map((product: any) => {
          // Find category name
          const category = categories.find(c => c.id === product.category_id);
          
          return {
            id: product.id,
            name: product.name,
            price: new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.price),
            salePrice: product.sale_price 
              ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.sale_price)
              : undefined,
            category: category?.name || "",
            description: product.short_description,
            imageUrl: imagesByProduct[product.id] || "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=600&h=400",
            featured: product.featured,
          };
        });

        setRelatedProducts(formattedProducts);
      } catch (error) {
        console.error("Error fetching related products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryId || currentProductId) {
      fetchRelatedProducts();
    }
  }, [categoryId, currentProductId, categories]);

  if (isLoading) {
    return (
      <Card className="my-8">
        <CardHeader>
          <CardTitle>Produtos Relacionados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <Card className="my-8">
      <CardHeader>
        <CardTitle>Produtos Relacionados</CardTitle>
      </CardHeader>
      <CardContent>
        <Carousel
          opts={{
            align: "start",
            loop: relatedProducts.length > 3,
          }}
          className="w-full"
        >
          <CarouselContent>
            {relatedProducts.map((product) => (
              <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <Link to={`/produto/${product.id}`} className="block group">
                  <div className="rounded-lg overflow-hidden border bg-white hover:shadow-md transition-shadow">
                    <AspectRatio ratio={4/3} className="bg-muted">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    </AspectRatio>
                    <div className="p-4">
                      <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <div className="mt-2">
                        {product.salePrice ? (
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground line-through">
                              {product.price}
                            </div>
                            <div className="font-bold text-red-600">
                              {product.salePrice}
                            </div>
                          </div>
                        ) : (
                          <div className="font-bold">
                            {product.price}
                          </div>
                        )}
                      </div>
                      {product.category && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          {product.category}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          {relatedProducts.length > 4 && (
            <>
              <CarouselPrevious className="-left-4 md:-left-5" />
              <CarouselNext className="-right-4 md:-right-5" />
            </>
          )}
        </Carousel>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link 
          to="/loja" 
          className="text-sm text-primary hover:underline"
        >
          Ver todos os produtos
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RelatedProducts;
