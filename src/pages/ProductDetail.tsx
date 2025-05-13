
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductMetaTags from "@/components/product-detail/ProductMetaTags";
import ProductDetailSkeleton from "@/components/product-detail/ProductDetailSkeleton";
import ProductNotFound from "@/components/product-detail/ProductNotFound";
import ProductDetailContent from "@/components/product-detail/ProductDetailContent";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { useToast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError("ID do produto não encontrado");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Fetch product data
        const { data: productData, error: productError } = await supabase
          .from("products")
          .select("*")
          .eq("id", productId)
          .single();

        if (productError) {
          throw new Error(productError.message);
        }

        if (!productData) {
          throw new Error("Produto não encontrado");
        }

        // Fetch product images
        const { data: imagesData, error: imagesError } = await supabase
          .from("product_images")
          .select("*")
          .eq("product_id", productId)
          .order("sort_order");

        if (imagesError) {
          throw new Error(imagesError.message);
        }

        // Convert category_id to string before creating the product object
        const categoryId = productData.category_id !== null && productData.category_id !== undefined 
          ? String(productData.category_id) 
          : null;
          
        // Process subcategory values ensuring they are all strings
        const subcategoryValues: Record<string, string> = {};
        if (productData.subcategory_values && typeof productData.subcategory_values === 'object') {
          Object.entries(productData.subcategory_values).forEach(([key, value]) => {
            subcategoryValues[key] = value !== null && value !== undefined ? String(value) : '';
          });
        }

        // Format the product with images
        const completeProduct: Product = {
          id: productData.id,
          name: productData.name,
          shortDescription: productData.short_description || "",
          description: productData.description || "",
          price: parseFloat(productData.price),
          salePrice: productData.sale_price ? parseFloat(productData.sale_price) : null,
          categoryId: categoryId,
          subcategoryValues: subcategoryValues,
          featured: productData.featured || false,
          published: productData.published !== undefined ? productData.published : true,
          stockQuantity: productData.stock_quantity || 0,
          images: imagesData.map((image) => ({
            id: image.id,
            url: image.url,
            sortOrder: image.sort_order
          })),
          createdAt: productData.created_at,
          updatedAt: productData.updated_at
        };

        setProduct(completeProduct);

        // Set page title for SEO
        document.title = `${completeProduct.name} | ONE BOSS Luxury Marketplace`;
      } catch (err: any) {
        console.error("Error fetching product:", err);
        setError(err.message || "Erro ao carregar produto");
        toast({
          title: "Erro",
          description: "Não foi possível carregar os detalhes do produto",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, toast]);

  // Handle back navigation
  const handleGoBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return <ProductNotFound error={error} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ProductMetaTags product={product} />
      <Header />
      <ProductDetailContent product={product} onGoBack={handleGoBack} />
      <Footer />
    </div>
  );
};

export default ProductDetail;
