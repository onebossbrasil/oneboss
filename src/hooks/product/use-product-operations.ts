
import { useAddProduct } from "@/hooks/product/use-add-product";
import { useUpdateProduct } from "@/hooks/product/use-update-product";
import { useDeleteProduct } from "@/hooks/product/use-delete-product";

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
