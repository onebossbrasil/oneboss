import React, { createContext, useContext, useEffect, useMemo, useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { fetchProductsFromSupabase } from "@/utils/product";
import { Product } from "@/types/product";

interface FeaturedProductContextType {
  featuredProducts: Product[];
  isLoading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
}

const FeaturedProductContext = createContext<FeaturedProductContextType | undefined>(undefined);

export const FeaturedProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("[FeaturedProductProvider] Carregando apenas produtos em destaque");
      const resp = await fetchProductsFromSupabase();
      
      if (resp.error) {
        console.error("[FeaturedProductProvider] Erro ao buscar produtos:", resp.error);
        throw new Error(resp.error);
      }

      // Filtrar apenas produtos em destaque e publicados
      const featuredOnly = resp.products.filter(
        (product) => product.featured === true && product.published === true
      );

      console.log("[FeaturedProductProvider] Produtos em destaque encontrados:", featuredOnly.length);
      setProducts(featuredOnly);
    } catch (err: any) {
      console.error('[FeaturedProductProvider] Falha ao carregar produtos em destaque:', err);
      setError(err.message || 'Falha ao conectar com o banco de dados');
      toast({
        title: 'Erro ao carregar produtos em destaque',
        description: err.message || 'Falha ao conectar com o banco de dados',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Carregamento inicial apenas quando o provider é montado
  useEffect(() => {
    console.log("[FeaturedProductProvider] Inicializando carregamento de produtos em destaque");
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  const refreshProducts = useCallback(async () => {
    console.log("[FeaturedProductProvider] Refresh manual solicitado");
    await fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  const contextValue = useMemo(() => ({
    featuredProducts: products,
    isLoading,
    error,
    refreshProducts
  }), [products, isLoading, error, refreshProducts]);

  console.log("FeaturedProductProvider rendering with", products.length, "featured products");

  return (
    <FeaturedProductContext.Provider value={contextValue}>
      {children}
    </FeaturedProductContext.Provider>
  );
};

export const useFeaturedProducts = () => {
  const context = useContext(FeaturedProductContext);
  if (context === undefined) {
    throw new Error("useFeaturedProducts must be used within a FeaturedProductProvider");
  }
  return context;
};