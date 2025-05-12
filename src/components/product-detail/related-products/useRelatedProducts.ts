
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FormattedProduct } from "@/types/product";
import { useCategories } from "@/contexts/CategoryContext";

export const useRelatedProducts = (currentProductId: string, categoryId: string | null) => {
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
          // Find category name - ensure string comparison
          const category = categories.find(c => c.id.toString() === product.category_id?.toString());
          
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

  return { relatedProducts, isLoading };
};
