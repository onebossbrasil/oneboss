
import React, { createContext, useContext, useState, useEffect } from "react";
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
  const { addProduct: addProductOperation, updateProduct: updateProductOperation, deleteProduct: deleteProductOperation } = useProductOperations();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { products: fetchedProducts, error: fetchError } = await fetchProductsFromSupabase();
      
      if (fetchError) {
        throw new Error(fetchError);
      }
      
      setProducts(fetchedProducts);
    } catch (err: any) {
      console.error('Error in fetchProducts:', err);
      setError(err.message);
      toast({
        title: 'Erro ao carregar produtos',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const refreshProducts = () => fetchProducts();

  // Get featured products as a computed property
  const featuredProducts = products.filter(product => product.featured);

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
