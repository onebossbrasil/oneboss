
import { Product } from "@/types/product";
import { useFormState } from "@/hooks/product-edit/use-form-state";
import { useCategorySelection } from "@/hooks/product-edit/use-category-selection";
import { useImageManagement } from "@/hooks/product-edit/use-image-management";
import { useProductSubmit } from "@/hooks/product-edit/use-product-submit";

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
  const { isSubmitting, handleUpdateProduct } = useProductSubmit(
    product,
    formData,
    selectedCategory,
    subcategoryValues,
    images,
    deletedImageIds,
    onClose
  );

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
    handleUpdateProduct
  };
};
