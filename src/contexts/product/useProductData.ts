
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import { fetchProductsFromSupabase } from "@/utils/productUtils";
import { useAuth } from "@/contexts/AuthContext";

export const useProductData = () => {
  const { toast } = useToast();
  const { session, user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Improved fetchProducts with retry logic
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching products, authenticated:", !!session?.access_token);
      if (user) {
        console.log("Fetching with user:", user.email);
      }
      
      const { products: fetchedProducts, error: fetchError } = await fetchProductsFromSupabase();
      
      if (fetchError) {
        throw new Error(fetchError);
      }
      
      setProducts(fetchedProducts);
      // Reset retry count on success
      setRetryCount(0);
    } catch (err: any) {
      console.error('Error in fetchProducts:', err);
      setError(err.message || 'Falha ao conectar com o banco de dados');
      
      // Implement exponential backoff for retries (max 3 retries)
      if (retryCount < 3) {
        const nextRetryDelay = Math.pow(2, retryCount) * 1000; // Exponential backoff: 1s, 2s, 4s
        console.log(`Tentando reconectar em ${nextRetryDelay / 1000} segundos...`);
        
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchProducts();
        }, nextRetryDelay);
        
        toast({
          title: 'Reconectando ao banco de dados',
          description: `Tentativa ${retryCount + 1} de 3...`,
          variant: 'default',
        });
      } else {
        toast({
          title: 'Erro ao carregar produtos',
          description: 'Não foi possível conectar ao banco de dados após várias tentativas.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast, retryCount, session, user]);

  // Get featured products as a computed property
  const featuredProducts = products.filter(product => product.featured && product.published);

  return {
    products,
    featuredProducts,
    isLoading,
    error,
    fetchProducts,
    setProducts,
    retryCount
  };
};
