
import { Product } from "@/types/product";

export type ProductContextType = {
  products: Product[];
  featuredProducts: Product[];
  isLoading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'images'>, images: File[]) => Promise<void>;
  updateProduct: (id: string, productData: Partial<Product>, newImages?: File[]) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  refreshProducts: () => Promise<void>;
};
