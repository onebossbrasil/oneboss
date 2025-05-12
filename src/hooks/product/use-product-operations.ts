
import { useAddProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/product";

export const useProductOperations = () => {
  const { isLoading: isAddLoading, addProduct } = useAddProduct();
  const { isLoading: isUpdateLoading, updateProduct } = useUpdateProduct();
  const { isLoading: isDeleteLoading, deleteProduct } = useDeleteProduct();
  
  // Combined loading state
  const isLoading = isAddLoading || isUpdateLoading || isDeleteLoading;

  return {
    isLoading,
    addProduct,
    updateProduct,
    deleteProduct
  };
};
