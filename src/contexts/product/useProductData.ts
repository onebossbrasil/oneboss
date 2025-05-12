
import { useState, useCallback, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import { fetchProductsFromSupabase } from "@/utils/product";
import { useAuth } from "@/contexts/AuthContext";

export const useProductData = () => {
  const { toast } = useToast();
  const { session, user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // Use a ref to track if a fetch is in progress
  const isFetchingRef = useRef(false);
  // Track the last successful fetch time to prevent excessive calls
  const lastFetchTimeRef = useRef<number>(0);
  // Minimum time between fetches (in milliseconds)
  const MIN_FETCH_INTERVAL = 2000;

  // Improved fetchProducts with retry logic, debounce and better request management
  const fetchProducts = useCallback(async (force = false) => {
    // Check if we're already fetching or if it's too soon since the last fetch
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTimeRef.current;
    
    if (isFetchingRef.current) {
      console.log("Fetch already in progress, skipping");
      return;
    }
    
    if (!force && timeSinceLastFetch < MIN_FETCH_INTERVAL) {
      console.log(`Throttling fetch request. Last fetch was ${timeSinceLastFetch}ms ago.`);
      return;
    }
    
    isFetchingRef.current = true;
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
      // Update last fetch time on success
      lastFetchTimeRef.current = Date.now();
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
          isFetchingRef.current = false; // Reset the flag before retrying
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
      isFetchingRef.current = false;
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
