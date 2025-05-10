
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import { fetchProductsFromSupabase } from "@/utils/productUtils";
import { useProductOperations } from "@/hooks/use-product-operations";

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
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { addProduct: addProductOperation, updateProduct: updateProductOperation, deleteProduct: deleteProductOperation } = useProductOperations();

  // Improved fetchProducts with retry logic
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
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
  }, [toast, retryCount]);

  // Load products when the component mounts or when retry count changes
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (
    product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'images'>, 
    images: File[]
  ) => {
    try {
      await addProductOperation(product, images);
      await fetchProducts(); // Refresh products list
    } catch (err) {
      // Error is already handled in the operation
    }
  };

  const updateProduct = async (
    id: string, 
    productData: Partial<Product>, 
    newImages?: File[]
  ) => {
    try {
      await updateProductOperation(id, productData, newImages);
      await fetchProducts(); // Refresh products list
    } catch (err) {
      // Error is already handled in the operation
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteProductOperation(id);
      await fetchProducts(); // Refresh products list
    } catch (err) {
      // Error is already handled in the operation
    }
  };

  const refreshProducts = useCallback(() => fetchProducts(), [fetchProducts]);

  // Get featured products as a computed property
  const featuredProducts = products.filter(product => product.featured && product.published);

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
