
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import { fetchProductsFromSupabase } from "@/utils/productUtils";
import { useProductOperations } from "@/hooks/use-product-operations";
import { useAuth } from "@/contexts/AuthContext";

type ProductContextType = {
  products: Product[];
  featuredProducts: Product[];
  isLoading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'images'>, images: File[]) => Promise<void>;
  updateProduct: (id: string, productData: Partial<Product>, newImages?: File[]) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  refreshProducts: () => Promise<void>;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const { session, user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { addProduct: addProductOperation, updateProduct: updateProductOperation, deleteProduct: deleteProductOperation } = useProductOperations();

  // Debug user authentication status
  useEffect(() => {
    if (user) {
      console.log("ProductContext: Usuario autenticado:", user.email);
    } else {
      console.log("ProductContext: Nenhum usuário autenticado");
    }
  }, [user]);

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

  // Load products when the component mounts or when retry count changes or session changes
  useEffect(() => {
    console.log("ProductProvider useEffect triggered, session:", !!session);
    // Only attempt to fetch if we have a session or we're not authenticated yet
    // This prevents excessive loading during auth transitions
    if (session || retryCount > 0) {
      fetchProducts();
    }
  }, [fetchProducts, session]);

  const addProduct = async (
    product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'images'>, 
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
      
      console.log("Adicionando produto como:", user?.email);
      await addProductOperation(product, images);
      await fetchProducts(); // Refresh products list
      
      toast({
        title: "Produto adicionado",
        description: "Produto adicionado com sucesso!",
        variant: "default"
      });
    } catch (err) {
      console.error("Erro ao adicionar produto:", err);
      // Error is already handled in the operation
    }
  };

  const updateProduct = async (
    id: string, 
    productData: Partial<Product>, 
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
      
      // Log detailed authentication information
      console.log("Atualizando produto como:", user.email);
      console.log("Token válido:", !!session.access_token);
      
      await updateProductOperation(id, productData, newImages);
      await fetchProducts(); // Refresh products list
      
      toast({
        title: "Produto atualizado",
        description: "As alterações foram salvas com sucesso!",
        variant: "default"
      });
    } catch (err) {
      console.error("Erro ao atualizar produto:", err);
      // Error is already handled in the operation
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      if (!session) {
        toast({
          title: 'Acesso negado',
          description: 'Você precisa estar autenticado para remover produtos.',
          variant: 'destructive',
        });
        return;
      }
      
      console.log("Removendo produto como:", user?.email);
      await deleteProductOperation(id);
      await fetchProducts(); // Refresh products list
    } catch (err) {
      // Error is already handled in the operation
    }
  };

  const refreshProducts = useCallback(() => fetchProducts(), [fetchProducts]);

  // Get featured products as a computed property
  const featuredProducts = products.filter(product => product.featured && product.published);

  console.log("ProductProvider rendering with", products.length, "products");

  return (
    <ProductContext.Provider value={{
      products,
      featuredProducts,
      isLoading,
      error,
      addProduct,
      updateProduct,
      deleteProduct,
      refreshProducts
    }}>
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
