
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductImage } from "@/types/product";

/**
 * Busca produto por ID, incluindo TODAS as imagens (ordem correta).
 */
export const useFetchProductById = (productId: string | null, open: boolean) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId || !open) {
        setProduct(null);
        return;
      }
      setIsLoading(true);

      // Busca produto pelo ID
      const { data: prodData, error: prodError } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .maybeSingle();

      if (prodError || !prodData) {
        setProduct(null);
        setIsLoading(false);
        return;
      }

      // Busca TODAS as imagens do produto, ordenadas!
      const { data: imagesData, error: imgError } = await supabase
        .from("product_images")
        .select("*")
        .eq("product_id", productId)
        .order("sort_order", { ascending: true });

      const images: ProductImage[] = Array.isArray(imagesData)
        ? imagesData.map(img => ({
            id: img.id,
            url: img.url,
            sortOrder: img.sort_order ?? 0
          }))
        : [];

      // Garante que o objeto de produto contém array images completo
      setProduct({
        id: prodData.id,
        name: prodData.name,
        shortDescription: prodData.short_description || "",
        description: prodData.description || "",
        price: prodData.price, // Corrigido: não usa parseFloat
        salePrice: prodData.sale_price ?? null, // Também corrigido
        categoryId: prodData.category_id,
        subcategoryId: prodData.subcategory_id ?? null,
        attributeId: prodData.attribute_id ?? null,
        published: prodData.published !== undefined ? prodData.published : true,
        featured: prodData.featured ?? false,
        stockQuantity: prodData.stock_quantity || 0,
        images: images, // <-- todas imagens do produto!
        createdAt: prodData.created_at,
        updatedAt: prodData.updated_at
      });

      setIsLoading(false);
    };

    fetchProduct();
    // eslint-disable-next-line
  }, [productId, open]);

  return { product, isLoading };
};
