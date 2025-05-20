
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
    handleSubcategoryChange,
    setSelectedCategory,
    setSubcategoryValues
  } = useCategorySelection(product);

  // Image management
  const {
    images,
    imagePreviewUrls,
    deletedImageIds,
    handleImageChange,
    handleRemoveImage,
    setImages,
    setImagePreviewUrls,
    setDeletedImageIds
  } = useImageManagement(product);

  // Form submission
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

  // Sempre que o produto for aberto para edição, resetar campos do formulário, categorias e imagens
  // Útil para reidratar valores caso modal seja reaberto em produto diferente
  // (Este effect é seguro porque hooks de estado já são sincronizados pelos outros hooks)
  // ... mas se complementarmente quiser resetar algum hook particular, pode fazer aqui

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
    handleSubmit,
    setSelectedCategory,
    setSubcategoryValues,
    setImages,
    setImagePreviewUrls,
    setDeletedImageIds
  };
};
