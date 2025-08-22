import { useState, useCallback, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import { fetchProductsFromSupabase, fetchProductsPageFromSupabase } from "@/utils/product";
import { useAuth } from "@/contexts/AuthContext";

type UseProductDataOptions = {
  paged?: boolean;
  initialPageSize?: number;
  filters?: {
    search?: string;
    categoryId?: string;
    subcategoryIds?: string[];
    attributeIds?: string[];
    status?: string;
  };
};

export const useProductData = (options: UseProductDataOptions = {}) => {
  const { paged = false, initialPageSize = 20, filters = {} } = options;
  const { toast } = useToast();
  const { session, user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalCount, setTotalCount] = useState(0);
  
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

  // Carregamento inicial
  useEffect(() => {
    console.log("[useProductData] Carregamento inicial automático");
    fetchProducts(true);
    // eslint-disable-next-line
  }, []); // Apenas na montagem

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
      console.log("[useProductData] Buscando produtos, paged:", paged, "filtros:", Object.keys(filters).length > 0 ? filters : "nenhum");
      
      let fetchedProducts: Product[] = [];
      let total = 0;
      let fetchError: string | null = null;
      if (paged) {
        const resp = await fetchProductsPageFromSupabase({ 
          page, 
          pageSize, 
          search: filters.search,
          categoryId: filters.categoryId,
          subcategoryIds: filters.subcategoryIds,
          attributeIds: filters.attributeIds,
          status: filters.status as "published" | "unpublished" | ""
        });
        fetchedProducts = resp.products;
        total = resp.totalCount;
        fetchError = resp.error;
      } else {
        const resp = await fetchProductsFromSupabase();
        fetchedProducts = resp.products;
        total = resp.products.length;
        fetchError = resp.error;
      }

      if (fetchError) {
        console.error("[useProductData] Erro ao buscar produtos:", fetchError);
        toast({
          title: 'Erro ao buscar produtos',
          description: fetchError,
          variant: 'destructive',
        });
        throw new Error(fetchError);
      }

      console.log("[useProductData] Produtos obtidos:", fetchedProducts.length, "Total:", total || fetchedProducts.length);
      setProducts(fetchedProducts);
      setTotalCount(total);
      lastFetchTimeRef.current = Date.now();
      setRetryCount(0);

      // Toast removido para evitar notificações excessivas
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
  }, [toast, retryCount, session, user, page, pageSize, paged, filters.search, filters.categoryId, filters.status, filters.subcategoryIds, filters.attributeIds]);
  
  // Adiciona diagnóstico para depurar featured/published real vindo do banco
  useEffect(() => {
    if (products && products.length > 0) {
      console.log("[Diagnóstico Produtos]:");
      products.forEach((p) => {
        console.log(
          `[Produto] id=${p.id} nome=${p.name} published=${String(p.published)} featured=${String(p.featured)}`
        );
      });
    }
  }, [products]);

  // Improved: robustez no filtro featuredProducts para só aceitar true explícito
  const featuredProducts = products.filter(
    (product) => product.featured === true && product.published === true
  );

  // Recarrega ao mudar paginação apenas quando estiver em modo paginado
  useEffect(() => {
    if (paged) {
      fetchProducts(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, paged]);

  // Recarrega ao mudar filtros e reseta para página 1
  useEffect(() => {
    if (paged) {
      console.log("[useProductData] Filtros mudaram, recarregando página 1");
      setPage(1);
      fetchProducts(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.categoryId, filters.status, filters.subcategoryIds, filters.attributeIds]);

  return {
    products,
    featuredProducts,
    isLoading,
    error,
    fetchProducts,
    setProducts,
    retryCount,
    page, setPage,
    pageSize, setPageSize,
    totalCount
  };
};
