import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { fetchProductsFromSupabase } from "@/utils/product/fetch-utils";
import { extractIdFromProductSlug } from "@/utils/slugUtils";

export const useFetchProductBySlug = (productSlug: string | null) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productSlug) {
        setProduct(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Primeiro, tenta extrair o ID do slug
        const extractedId = extractIdFromProductSlug(productSlug);
        
        if (extractedId) {
          // Se conseguiu extrair o ID, busca diretamente
          console.log(`[useFetchProductBySlug] Extraído ID do slug ${productSlug}: ${extractedId}`);
          
          // Busca todos os produtos (pode ser otimizado depois para buscar apenas por ID)
          const { products, error: fetchError } = await fetchProductsFromSupabase();
          
          if (fetchError) {
            setError(fetchError);
            return;
          }

          // Procura o produto pelo ID extraído
          const foundProduct = products.find(p => p.id.startsWith(extractedId));
          
          if (foundProduct) {
            console.log(`[useFetchProductBySlug] Produto encontrado: ${foundProduct.name}`);
            setProduct(foundProduct);
          } else {
            console.log(`[useFetchProductBySlug] Produto não encontrado com ID: ${extractedId}`);
            setError("Produto não encontrado");
          }
        } else {
          // Se não conseguiu extrair o ID, procura por nome/slug
          console.log(`[useFetchProductBySlug] Não foi possível extrair ID do slug ${productSlug}, buscando por nome`);
          
          const { products, error: fetchError } = await fetchProductsFromSupabase();
          
          if (fetchError) {
            setError(fetchError);
            return;
          }

          // Procura o produto pelo slug gerado
          const foundProduct = products.find(p => p.slug === productSlug);
          
          if (foundProduct) {
            console.log(`[useFetchProductBySlug] Produto encontrado por slug: ${foundProduct.name}`);
            setProduct(foundProduct);
          } else {
            console.log(`[useFetchProductBySlug] Produto não encontrado com slug: ${productSlug}`);
            setError("Produto não encontrado");
          }
        }
      } catch (err) {
        console.error("[useFetchProductBySlug] Erro ao buscar produto:", err);
        setError("Erro ao carregar produto");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productSlug]);

  return { product, isLoading, error };
};