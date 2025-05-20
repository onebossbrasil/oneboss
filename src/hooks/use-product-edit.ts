import React, { useState } from "react";
import { Product } from "@/types/product";
import { useFormState } from "@/hooks/product-edit/use-form-state";
import { useCategorySelection } from "@/hooks/product-edit/use-category-selection";
import { useImageManagement } from "@/hooks/product-edit/use-image-management";
import { useProductSubmit } from "@/hooks/product-edit/use-product-submit";
import { useProductAdd } from "@/hooks/product-edit/use-product-add";

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

  // Sincroniza ids ao mudar produto
  React.useEffect(() => {
    setSelectedSubcategoryId(product?.subcategoryId ?? null);
    setSelectedAttributeId(product?.attributeId ?? null);
  }, [product?.id]);

  // Diagnóstico para sincronização dos ids (LOG)
  React.useEffect(() => {
    console.log("[useProductEdit] selectedCategory:", selectedCategory);
    console.log("[useProductEdit] selectedSubcategoryId:", selectedSubcategoryId);
    console.log("[useProductEdit] selectedAttributeId:", selectedAttributeId);
  }, [selectedCategory, selectedSubcategoryId, selectedAttributeId]);

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

  // Handler para CategorySelector para atualizar selectedSubcategoryId e AttributeId
  const handleSubcategoryIdChange = (subcategoryId: string | null) => {
    setSelectedSubcategoryId(subcategoryId);
    setSelectedAttributeId(null);
    console.log("[useProductEdit] setSelectedSubcategoryId (UUID):", subcategoryId);
  };

  // Handler para atributo UUID
  const handleAttributeChange = (attributeId: string | null) => {
    setSelectedAttributeId(attributeId);
    console.log("[useProductEdit] setSelectedAttributeId (UUID):", attributeId);
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
    handleSubcatIdChange: handleSubcategoryIdChange
  };
};
