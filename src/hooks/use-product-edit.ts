
import React, { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { useFormState } from "@/hooks/product-edit/use-form-state";
import { useCategorySelection } from "@/hooks/product-edit/use-category-selection";
import { useImageManagement } from "@/hooks/product-edit/use-image-management";
import { useProductSubmit } from "@/hooks/product-edit/use-product-submit";
import { useProductAdd } from "@/hooks/product-edit/use-product-add";

// Novo helper para comparar IDs (evita repetição/SW bugs)
const isEqual = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);

export const useProductEdit = (
  product: Product | null,
  onClose: () => void
) => {
  const { formData, handleFormChange, setFormData } = useFormState(product);

  // ---- SÍNCRONO ----
  // Ao receber freshProduct, sincronizar estados internos: categoria, subcategoria, atributo
  const [selectedCategory, setSelectedCategory] = useState<string>(product?.categoryId ?? "");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(product?.subcategoryId ?? null);
  const [selectedAttributeId, setSelectedAttributeId] = useState<string | null>(product?.attributeId ?? null);
  const [subcategoryValues, setSubcategoryValues] = useState<Record<string, string>>(product?.subcategoryValues ?? {});

  useEffect(() => {
    if (product) {
      // Se algum dos campos mudou, atualiza o estado
      if (selectedCategory !== (product.categoryId ?? "")) {
        setSelectedCategory(product.categoryId ?? "");
      }
      if (!isEqual(selectedSubcategoryId, product.subcategoryId ?? null)) {
        setSelectedSubcategoryId(product.subcategoryId ?? null);
      }
      if (!isEqual(selectedAttributeId, product.attributeId ?? null)) {
        setSelectedAttributeId(product.attributeId ?? null);
      }
      if (!isEqual(subcategoryValues, product.subcategoryValues ?? {})) {
        setSubcategoryValues(product.subcategoryValues ?? {});
      }
      // Formulário textual já era reidratado antes
      setFormData({
        name: product.name,
        shortDescription: product.shortDescription || "",
        description: product.description,
        price: product.price.toString(),
        salePrice: product.salePrice ? product.salePrice.toString() : "",
        stockQuantity: product.stockQuantity.toString(),
        published: product.published,
        featured: product.featured
      });
      console.log("[useProductEdit] Estados sincronizados com produto fresh:", {
        categoria: product.categoryId,
        subcategoria: product.subcategoryId,
        atributo: product.attributeId,
        valores: product.subcategoryValues,
      });
    }
    // eslint-disable-next-line
  }, [product?.id]);

  // ---- SELEÇÃO DE CATEGORIA/SUBCATEGORIA/Atributo ----
  // Garante que os handlers atualizem o estado sincronizando
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSubcategoryValues({});
    setSelectedSubcategoryId(null); // Reseta subcategoria
    setSelectedAttributeId(null); // Reseta atributo
    console.log("[useProductEdit] Categoria alterada (resetou subcat e attr):", categoryId);
  };

  const handleSubcategoryIdChange = (subcategoryId: string | null) => {
    setSelectedSubcategoryId(subcategoryId);
    setSelectedAttributeId(null); // reset atributo ao trocar subcat
    console.log("[useProductEdit] setSelectedSubcategoryId (UUID):", subcategoryId);
  };

  const handleAttributeChange = (attributeId: string | null) => {
    setSelectedAttributeId(attributeId);
    console.log("[useProductEdit] setSelectedAttributeId (UUID):", attributeId);
  };

  // Síncrono com outros hooks do produto
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
    handleSubcategoryChange: (type: string, value: string) => {
      setSubcategoryValues(prev => ({
        ...prev,
        [type]: value,
      }));
    },
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
