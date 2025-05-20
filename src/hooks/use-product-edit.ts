
import { Product } from "@/types/product";
import { useFormState } from "@/hooks/product-edit/use-form-state";
import { useCategorySelection } from "@/hooks/product-edit/use-category-selection";
import { useImageManagement } from "@/hooks/product-edit/use-image-management";
import { useProductSubmit } from "@/hooks/product-edit/use-product-submit";
import { useProductAdd } from "@/hooks/product-edit/use-product-add"; // NOVO IMPORT
import { useState } from "react";

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

  // States para subcategoria e atributo
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(product?.subcategoryId ?? null);
  const [selectedAttributeId, setSelectedAttributeId] = useState<string | null>(product?.attributeId ?? null);

  // A cada abertura de produto, manter sincronizado os ids com o produto carregado
  React.useEffect(() => {
    setSelectedSubcategoryId(product?.subcategoryId ?? null);
    setSelectedAttributeId(product?.attributeId ?? null);
  }, [product?.id]);

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
    onClose,
    selectedSubcategoryId,
    selectedAttributeId
  );

  const { isSubmitting: isAdding, handleAddProduct } = useProductAdd(
    formData,
    selectedCategory,
    subcategoryValues,
    images,
    onClose,
    selectedSubcategoryId,
    selectedAttributeId
  );

  // Decide qual handler usar: edição ou cadastro
  const isEditMode = !!product;
  const isSubmitting = isEditMode ? isUpdating : isAdding;
  const handleSubmit = isEditMode ? handleUpdateProduct : handleAddProduct;

  // Novo: Receber os handlers para CategorySelector
  const handleSubcategoryIdChange = (subcategoryId: string | null) => {
    setSelectedSubcategoryId(subcategoryId);
    // Ao trocar subcategoria, limpamos o atributo
    setSelectedAttributeId(null);
  };

  const handleAttributeChange = (attributeId: string | null) => {
    setSelectedAttributeId(attributeId);
  };

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
    setDeletedImageIds,
    selectedSubcategoryId,
    selectedAttributeId,
    handleAttributeChange,
    handleSubcategoryChange: handleSubcategoryIdChange
  };
};
