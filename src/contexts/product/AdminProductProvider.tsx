import React, { createContext, useContext, useEffect, useMemo, useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useProductOperations } from "@/hooks/use-product-operations";
import { useProductData } from "./useProductData";
import { ProductContextType } from "./types";

// Contexto específico para Admin com filtros
const AdminProductContext = createContext<ProductContextType & {
  filters: {
    search: string;
    categoryId: string;
    status: string;
  };
  setFilters: (filters: { search?: string; categoryId?: string; status?: string }) => void;
} | undefined>(undefined);

export const AdminProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const { session, user } = useAuth();
  const { addProduct: addProductOperation, updateProduct: updateProductOperation, deleteProduct: deleteProductOperation } = useProductOperations();
  
  // Estados dos filtros
  const [filters, setFiltersState] = useState({
    search: "",
    categoryId: "",
    status: ""
  });

  console.log("[AdminProductProvider] Filtros para useProductData:", {
    search: filters.search,
    categoryId: filters.categoryId,
    status: filters.status
  });

  const { 
    products, 
    featuredProducts, 
    isLoading, 
    error, 
    fetchProducts, 
    retryCount,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalCount
  } = useProductData({ 
    paged: true, 
    initialPageSize: 20,
    filters: {
      search: filters.search,
      categoryId: filters.categoryId,
      status: filters.status
    }
  });

  // Debug user authentication status
  useEffect(() => {
    if (user) {
      console.log("AdminProductContext: Usuario autenticado:", user.email);
    } else {
      console.log("AdminProductContext: Nenhum usuário autenticado");
    }
  }, [user]);
  
  // Carregamento inicial removido - useProductData já carrega automaticamente com os filtros

  // Stable refreshProducts function with force parameter
  const refreshProducts = useCallback(async (force = true) => {
    console.log("[AdminProductProvider] Manual refresh products requested, force =", force);
    const res = await fetchProducts(force);
    console.log("[AdminProductProvider] refreshProducts completed.");
    return res;
  }, [fetchProducts]);

  // Função para atualizar filtros
  const setFilters = useCallback((newFilters: { search?: string; categoryId?: string; status?: string }) => {
    console.log("[AdminProductProvider] Atualizando filtros:", newFilters);
    setFiltersState(prev => {
      const updated = {
        ...prev,
        ...newFilters
      };
      console.log("[AdminProductProvider] Filtros atualizados:", updated);
      return updated;
    });
  }, []);

  // Optimized product operations
  const addProduct = useCallback(async (
    product: Omit<ProductContextType["products"][0], 'id' | 'createdAt' | 'updatedAt' | 'images'>, 
    images: File[]
  ) => {
    try {
      if (!session) {
        toast({
          title: 'Acesso negado',
          description: 'Você precisa estar autenticado para adicionar produtos.',
          variant: 'destructive',
        });
        return;
      }
      console.log("[AdminProductProvider] Adicionando produto como:", user?.email);
      await addProductOperation(product, images);
      await refreshProducts(); 
      toast({
        title: "Produto adicionado",
        description: "Produto adicionado com sucesso!",
        variant: "default"
      });
    } catch (err) {
      console.error("[AdminProductProvider] Erro ao adicionar produto:", err);
      // Error is already handled in the operation
    }
  }, [session, user, addProductOperation, refreshProducts, toast]);

  const updateProduct = useCallback(async (
    id: string, 
    productData: Partial<ProductContextType["products"][0]>, 
    newImages?: File[]
  ) => {
    try {
      if (!session || !user) {
        toast({
          title: 'Acesso negado',
          description: 'Você precisa estar autenticado para atualizar produtos.',
          variant: 'destructive',
        });
        return;
      }
      console.log("[AdminProductProvider] Atualizando produto como:", user.email, "ProductId:", id);
      await updateProductOperation(id, productData, newImages);
      console.log("[AdminProductProvider] Produto atualizado no Supabase, agora refrescando lista...");
      await refreshProducts(true);
      toast({
        title: "Produto atualizado",
        description: "As alterações foram salvas e sincronizadas!",
        variant: "default"
      });
    } catch (err) {
      console.error("[AdminProductProvider] Erro ao atualizar produto:", err);
    }
  }, [session, user, updateProductOperation, refreshProducts, toast]);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      if (!session) {
        toast({
          title: 'Acesso negado',
          description: 'Você precisa estar autenticado para remover produtos.',
          variant: 'destructive',
        });
        return;
      }
      console.log("[AdminProductProvider] Removendo produto como:", user?.email, "ProductId:", id);
      await deleteProductOperation(id);
      await refreshProducts();
    } catch (err) {
      // Error is already handled in the operation
    }
  }, [session, user, deleteProductOperation, refreshProducts, toast]);

  // Deep memoization of context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    products,
    featuredProducts,
    isLoading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalCount,
    filters,
    setFilters
  }), [
    products, 
    featuredProducts, 
    isLoading, 
    error, 
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalCount,
    filters,
    setFilters
  ]);

  console.log("AdminProductProvider rendering with", products.length, "products, totalCount:", totalCount, "filters:", filters);

  return (
    <AdminProductContext.Provider value={contextValue}>
      {children}
    </AdminProductContext.Provider>
  );
};

export const useAdminProducts = () => {
  const context = useContext(AdminProductContext);
  if (context === undefined) {
    throw new Error("useAdminProducts must be used within an AdminProductProvider");
  }
  return context;
};