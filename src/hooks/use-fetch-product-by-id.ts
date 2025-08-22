import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductImage } from "@/types/product";

type ProductRow = {
  id: string;
  name: string;
  short_description: string;
  description: string;
  price: number;
  sale_price: number | null;
  category_id: string;
  subcategory_id: string | null;
  attribute_id: string | null;
  published: boolean;
  featured: boolean;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
  price_on_request: boolean;
};

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

      const row = prodData as ProductRow;

      console.log("[useFetchProductById] Produto carregado:", {
        id: row.id,
        name: row.name,
        price_on_request: row.price_on_request,
        price: row.price
      });

      // Garante que o objeto de produto contém array images completo
      const priceOnRequest = row.price_on_request === true;
      
      setProduct({
        id: row.id,
        name: row.name,
        shortDescription: row.short_description || "",
        description: row.description || "",
        price: priceOnRequest ? null : row.price,
        salePrice: priceOnRequest ? null : (row.sale_price ?? null),
        categoryId: row.category_id,
        subcategoryId: row.subcategory_id ?? null,
        attributeId: row.attribute_id ?? null,
        published: row.published !== undefined ? row.published : true,
        featured: row.featured ?? false,
        stockQuantity: row.stock_quantity || 0,
        images: images,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        priceOnRequest
      });

      console.log("[useFetchProductById] Produto formatado:", {
        name: row.name,
        priceOnRequest,
        price: priceOnRequest ? null : row.price
      });

      setIsLoading(false);
    };

    fetchProduct();
    // eslint-disable-next-line
  }, [productId, open]);

  return { product, isLoading };
};
