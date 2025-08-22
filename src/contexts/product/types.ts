
import { Product } from "@/types/product";

export type ProductContextType = {
  products: Product[];
  featuredProducts: Product[];
  isLoading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'images'>, images: File[]) => Promise<void>;
  updateProduct: (id: string, productData: Partial<Product>, newImages?: File[]) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  refreshProducts: (force?: boolean) => Promise<void>;
  // paginação server-side (Admin)
  page?: number;
  setPage?: (p: number) => void;
  pageSize?: number;
  setPageSize?: (n: number) => void;
  totalCount?: number;
};
