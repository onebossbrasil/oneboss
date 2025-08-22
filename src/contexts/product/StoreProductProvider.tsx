import React, { createContext, useContext, useEffect, useMemo, useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useProductData } from "./useProductData";
import { Product } from "@/types/product";

// Contexto específico para Store com paginação server-side
const StoreProductContext = createContext<{
  products: Product[];
  featuredProducts: Product[];
  isLoading: boolean;
  error: string | null;
  // Filtros
  filters: {
    search: string;
    categoryId: string;
    subcategoryIds: string[];
    attributeIds: string[];
    sortOption: "relevance" | "price-asc" | "price-desc" | "newest";
  };
  setFilters: (filters: Partial<typeof filters>) => void;
  // Paginação
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  totalCount: number;
  productsPerPage: number;
  // Para compatibilidade com a interface atual
  filteredProducts: Product[];
  paginatedProducts: Product[];
} | undefined>(undefined);

export const StoreProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const { session, user } = useAuth();
  
  // Estados dos filtros (compatível com a interface atual)
  const [filters, setFiltersState] = useState({
    search: "",
    categoryId: "",
    subcategoryIds: [] as string[],
    attributeIds: [] as string[],
    sortOption: "relevance" as "relevance" | "price-asc" | "price-desc" | "newest"
  });

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Converte filtros da loja para formato do servidor
  const serverFilters = useMemo(() => ({
    search: filters.search,
    categoryId: filters.categoryId,
    subcategoryIds: filters.subcategoryIds,
    attributeIds: filters.attributeIds,
    status: "published" as const, // Loja só mostra produtos publicados
  }), [filters.search, filters.categoryId, filters.subcategoryIds, filters.attributeIds]);

  const { 
    products, 
    featuredProducts, 
    isLoading, 
    error, 
    fetchProducts, 
    page,
    setPage,
    totalCount
  } = useProductData({ 
    paged: true, 
    initialPageSize: productsPerPage,
    filters: serverFilters
  });

  // Sincroniza página local com página do servidor
  useEffect(() => {
    if (page !== currentPage) {
      setPage(currentPage);
    }
  }, [currentPage, setPage, page]);

  // Debug: Log dos filtros sempre que mudarem
  useEffect(() => {
    console.log("[StoreProductProvider] Filtros atualizados:", serverFilters);
  }, [serverFilters]);

  // Calcula totalPages baseado no totalCount do servidor
  const totalPages = Math.max(1, Math.ceil(totalCount / productsPerPage));

  // Função para atualizar filtros
  const setFilters = useCallback((newFilters: Partial<typeof filters>) => {
    console.log("[StoreProductProvider] Atualizando filtros:", newFilters);
    setFiltersState(prev => {
      const updated = {
        ...prev,
        ...newFilters
      };
      console.log("[StoreProductProvider] Filtros atualizados:", updated);
      return updated;
    });
    // Reset para página 1 quando filtros mudam
    if (newFilters.search !== undefined || newFilters.categoryId !== undefined) {
      setCurrentPage(1);
    }
  }, []);

  // Aplicar apenas ordenação client-side (filtros são server-side)
  const finalFilteredProducts = useMemo(() => {
    let result = products;

    // Ordenação (client-side para manter compatibilidade)
    if (filters.sortOption === "price-asc") {
      result = [...result].sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (filters.sortOption === "price-desc") {
      result = [...result].sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else if (filters.sortOption === "newest") {
      result = [...result].sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }

    return result;
  }, [products, filters.sortOption]);

  // Para compatibilidade com a interface atual da loja
  const filteredProducts = finalFilteredProducts;
  const paginatedProducts = finalFilteredProducts;

  const contextValue = useMemo(() => ({
    products: finalFilteredProducts,
    featuredProducts,
    isLoading,
    error,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCount,
    productsPerPage,
    // Para compatibilidade
    filteredProducts: finalFilteredProducts,
    paginatedProducts: finalFilteredProducts
  }), [
    finalFilteredProducts,
    featuredProducts,
    isLoading,
    error,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCount,
    productsPerPage
  ]);

  console.log("StoreProductProvider rendering with", products.length, "products, totalCount:", totalCount, "currentPage:", currentPage);

  return (
    <StoreProductContext.Provider value={contextValue}>
      {children}
    </StoreProductContext.Provider>
  );
};

export const useStoreProducts = () => {
  const context = useContext(StoreProductContext);
  if (context === undefined) {
    throw new Error("useStoreProducts must be used within a StoreProductProvider");
  }
  return context;
};