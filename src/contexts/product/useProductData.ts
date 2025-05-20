
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

  // Diagnóstico extra!
  useEffect(() => {
    console.log("[useProductData] Inicializado. Session?", session, "User?", user);
  }, [session, user]);

  // Improved fetchProducts with retry logic, debounce and better request management
  const fetchProducts = useCallback(async (force = false) => {
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTimeRef.current;
    
    if (isFetchingRef.current) {
      console.warn("[useProductData] Fetch já em andamento, ignorado.");
      return;
    }
    
    if (!force && timeSinceLastFetch < MIN_FETCH_INTERVAL) {
      console.log(`[useProductData] Bloqueio temporal. Última busca há ${timeSinceLastFetch}ms.`);
      return;
    }
    
    isFetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      console.log("[useProductData] Buscando produtos (autenticado?", !!session?.access_token, ")");
      if (user) {
        console.log("[useProductData] Buscando como usuário:", user.email);
      }
      
      const { products: fetchedProducts, error: fetchError } = await fetchProductsFromSupabase();

      if (fetchError) {
        console.error("[useProductData] Erro ao buscar produtos:", fetchError);
        toast({
          title: 'Erro ao buscar produtos',
          description: fetchError,
          variant: 'destructive',
        });
        throw new Error(fetchError);
      }

      console.log("[useProductData] Produtos obtidos:", fetchedProducts.length);
      setProducts(fetchedProducts);
      lastFetchTimeRef.current = Date.now();
      setRetryCount(0);

      toast({
        title: 'Sincronização concluída',
        description: 'Lista de produtos carregada do Supabase.',
        variant: "default"
      });
    } catch (err: any) {
      console.error('[useProductData] Falha na conexão com Supabase:', err);
      setError(err.message || 'Falha ao conectar com o banco de dados');
      if (retryCount < 3) {
        const nextRetryDelay = Math.pow(2, retryCount) * 1000;
        console.warn(`[useProductData] Tentando reconectar em ${nextRetryDelay / 1000}s...`);
        
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          isFetchingRef.current = false;
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
          description: 'Não foi possível conectar ao banco após várias tentativas.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [toast, retryCount, session, user]);

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
