
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/product-detail/ProductGallery";
import ProductInfo from "@/components/product-detail/ProductInfo";
import ProductDescription from "@/components/product-detail/ProductDescription";
import ProductAdditionalInfo from "@/components/product-detail/ProductAdditionalInfo";
import ProductMetaTags from "@/components/product-detail/ProductMetaTags";
import RelatedProducts from "@/components/product-detail/RelatedProducts";
import ContactSection from "@/components/product-detail/ContactSection";
import ProductBreadcrumbs from "@/components/product-detail/ProductBreadcrumbs";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Loader2 } from "lucide-react";

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

        // Format the product with images
        const completeProduct: Product = {
          id: productData.id,
          name: productData.name,
          shortDescription: productData.short_description || "",
          description: productData.description || "",
          price: parseFloat(productData.price),
          salePrice: productData.sale_price ? parseFloat(productData.sale_price) : null,
          // Ensure categoryId is a string
          categoryId: productData.category_id ? String(productData.category_id) : null,
          // Ensure subcategoryValues is Record<string, string>
          subcategoryValues: productData.subcategory_values ? 
            (typeof productData.subcategory_values === 'object' ? 
              Object.entries(productData.subcategory_values).reduce((acc, [key, value]) => {
                acc[key] = String(value);
                return acc;
              }, {} as Record<string, string>) : 
              {}) : 
            {},
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
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-xl text-muted-foreground">Carregando produto...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-destructive mb-4">
              {error || "Produto não encontrado"}
            </h2>
            <p className="mb-6 text-muted-foreground">
              Não foi possível encontrar o produto solicitado.
            </p>
            <Link
              to="/loja"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
            >
              Voltar para a loja
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ProductMetaTags product={product} />
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Back button and Breadcrumbs */}
        <div className="mb-6">
          <button 
            onClick={handleGoBack}
            className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar
          </button>
          <ProductBreadcrumbs product={product} />
        </div>
        
        {/* Product Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Product Gallery */}
          <ProductGallery images={product.images} productName={product.name} />
          
          {/* Product Info */}
          <ProductInfo product={product} />
        </div>
        
        {/* Product Description and Details */}
        <ProductDescription product={product} />
        
        {/* Additional Information */}
        <ProductAdditionalInfo />
        
        {/* Related Products */}
        <RelatedProducts currentProductId={product.id} categoryId={product.categoryId} />
        
        {/* Contact Section */}
        <ContactSection productName={product.name} productId={product.id} />
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
