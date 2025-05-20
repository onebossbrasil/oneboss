
import React, { createContext, useContext, useEffect, useMemo, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useProductOperations } from "@/hooks/use-product-operations";
import { useProductData } from "./useProductData";
import { ProductContextType } from "./types";

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const { session, user } = useAuth();
  const { addProduct: addProductOperation, updateProduct: updateProductOperation, deleteProduct: deleteProductOperation } = useProductOperations();
  const { 
    products, 
    featuredProducts, 
    isLoading, 
    error, 
    fetchProducts, 
    retryCount 
  } = useProductData();

  // Debug user authentication status
  useEffect(() => {
    if (user) {
      console.log("ProductContext: Usuario autenticado:", user.email);
    } else {
      console.log("ProductContext: Nenhum usuário autenticado");
    }
  }, [user]);
  
  // Always fetch products regardless of authentication status
  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      console.log("ProductProvider requesting fetchProducts: Initial");
      fetchProducts();
    }
    return () => {
      isMounted = false;
    };
  }, [fetchProducts]);

  // Stable refreshProducts function with force parameter
  const refreshProducts = useCallback(async (force = true) => {
    console.log("[ProductProvider] Manual refresh products requested, force =", force);
    const res = await fetchProducts(force);
    console.log("[ProductProvider] refreshProducts completed.");
    return res;
  }, [fetchProducts]);

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
      console.log("[ProductProvider] Adicionando produto como:", user?.email);
      await addProductOperation(product, images);
      await refreshProducts(); 
      toast({
        title: "Produto adicionado",
        description: "Produto adicionado com sucesso!",
        variant: "default"
      });
    } catch (err) {
      console.error("[ProductProvider] Erro ao adicionar produto:", err);
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
      console.log("[ProductProvider] Atualizando produto como:", user.email, "ProductId:", id);
      await updateProductOperation(id, productData, newImages);
      console.log("[ProductProvider] Produto atualizado no Supabase, agora refrescando lista...");
      await refreshProducts(true); // <--- aguarda atualizar lista!
      toast({
        title: "Produto atualizado",
        description: "As alterações foram salvas e sincronizadas!",
        variant: "default"
      });
    } catch (err) {
      console.error("[ProductProvider] Erro ao atualizar produto:", err);
      // Error is already handled in the operation
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
      console.log("[ProductProvider] Removendo produto como:", user?.email, "ProductId:", id);
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
    refreshProducts
  }), [
    products, 
    featuredProducts, 
    isLoading, 
    error, 
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts
  ]);

  console.log("ProductProvider rendering with", products.length, "products");

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
