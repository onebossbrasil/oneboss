
import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { fetchProductsFromSupabase } from "@/utils/product";

export const useFetchProductById = (productId: string | null, open: boolean) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId || !open) return;
      setIsLoading(true);

      try {
        const { products, error } = await fetchProductsFromSupabase();
        if (error) throw new Error(error);
        const found = products.find(p => p.id === productId) || null;
        setProduct(found);
      } catch (err) {
        console.error("Erro ao buscar produto para edição:", err);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, open]);

  return { product, isLoading };
};
