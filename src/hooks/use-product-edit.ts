
import { Product } from "@/types/product";
import { useFormState } from "@/hooks/product-edit/use-form-state";
import { useCategorySelection } from "@/hooks/product-edit/use-category-selection";
import { useImageManagement } from "@/hooks/product-edit/use-image-management";
import { useProductSubmit } from "@/hooks/product-edit/use-product-submit";
import { useProductAdd } from "@/hooks/product-edit/use-product-add"; // NOVO IMPORT

export const useProductEdit = (
  product: Product | null,
  onClose: () => void
) => {
  // Form state management
  const { formData, handleFormChange } = useFormState(product);
  
  // Category and subcategory selection
  const { 
    selectedCategory,
    subcategoryValues,
    handleCategoryChange,
    handleSubcategoryChange
  } = useCategorySelection(product);
  
  // Image management
  const {
    images,
    imagePreviewUrls,
    deletedImageIds,
    handleImageChange,
    handleRemoveImage
  } = useImageManagement(product);
  
  // Form submission
  // Dois hooks, um para editar, outro para adicionar:
  const { isSubmitting: isUpdating, handleUpdateProduct } = useProductSubmit(
    product,
    formData,
    selectedCategory,
    subcategoryValues,
    images,
    deletedImageIds,
    onClose
  );

  const { isSubmitting: isAdding, handleAddProduct } = useProductAdd(
    formData,
    selectedCategory,
    subcategoryValues,
    images,
    onClose
  );

  // Decide qual handler usar: edição ou cadastro
  const isEditMode = !!product;
  const isSubmitting = isEditMode ? isUpdating : isAdding;
  const handleSubmit = isEditMode ? handleUpdateProduct : handleAddProduct;

  return {
    formData,
    selectedCategory,
    subcategoryValues,
    images,
    imagePreviewUrls,
    isSubmitting,
    handleFormChange,
    handleCategoryChange,
    handleSubcategoryChange,
    handleImageChange,
    handleRemoveImage,
    handleSubmit // Sempre usar este para <form onSubmit>
  };
};
