import React, { useState, useEffect, useRef } from "react";
import { Product } from "@/types/product";
import { useFormState } from "@/hooks/product-edit/use-form-state";
import { useImageManagement } from "@/hooks/product-edit/use-image-management";
import { useProductSubmit } from "@/hooks/product-edit/use-product-submit";
import { useProductAdd } from "@/hooks/product-edit/use-product-add";
import { useCategories } from "@/contexts/CategoryContext";

// Novo helper para comparar IDs (evita repetição/SW bugs)
const isEqual = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);

export const useProductEdit = (
  product: Product | null,
  onClose: () => void
) => {
  const { formData, handleFormChange, setFormData } = useFormState(product);

  // Busca categorias do contexto (para garantir ressincronização quando carregam)
  const { categories, isLoading: catLoading } = useCategories();

  // Estados para seleção
  const [selectedCategory, setSelectedCategory] = useState<string>(product?.categoryId ?? "");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(product?.subcategoryId ?? null);
  const [selectedAttributeId, setSelectedAttributeId] = useState<string | null>(product?.attributeId ?? null);

  // Para evitar trigger desnecessário
  const lastProductId = useRef<string | null>(null);

  // Sincroniza selects APENAS na troca de produto ou ao carregar categorias pela primeira vez (evita reset indiscriminado)
  useEffect(() => {
    if (product && product.id !== lastProductId.current) {
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
      setSelectedCategory(product.categoryId ?? "");
      setSelectedSubcategoryId(product.subcategoryId ?? null);
      setSelectedAttributeId(product.attributeId ?? null);
      lastProductId.current = product.id;
      console.log(
        "[useProductEdit] Produto fresh recebido. Setando IDs:",
        product.categoryId, product.subcategoryId, product.attributeId
      );
    }
    // eslint-disable-next-line
  }, [product?.id]);

  // Sincroniza selects após carregar categorias e atualizar produto
  useEffect(() => {
    if (!catLoading && categories.length > 0 && product && product.id === lastProductId.current) {
      const cat = categories.find(cat => cat.id === product.categoryId);
      if (cat) {
        setSelectedCategory(product.categoryId ?? "");
        const subcat = cat.subcategories.find(sc => sc.id === product.subcategoryId);
        if (subcat) {
          setSelectedSubcategoryId(product.subcategoryId ?? null);
          // Só seta selectedAttributeId se não existe ou não está na lista
          const attrExists = subcat.attributes.find(at => at.id === selectedAttributeId);
          if (!attrExists) {
            if (subcat.attributes.length > 0) {
              setSelectedAttributeId(subcat.attributes[0].id);
            } else {
              setSelectedAttributeId(null);
            }
          }
        }
      }
    }
    // eslint-disable-next-line
  }, [categories, catLoading, product?.id]);

  // --- Handlers principais ---
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategoryId(null);
    setSelectedAttributeId(null);
    console.log("[useProductEdit] Categoria alterada:", categoryId);
  };

  const handleSubcategoryIdChange = (subcategoryId: string | null) => {
    setSelectedSubcategoryId(subcategoryId);
    setSelectedAttributeId(null);
    console.log("[useProductEdit] setSelectedSubcategoryId:", subcategoryId);
  };

  const handleAttributeChange = (attributeId: string | null) => {
    setSelectedAttributeId(attributeId);
    console.log("[useProductEdit] setSelectedAttributeId:", attributeId);
  };

  // Hooks auxiliares para imagem
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

  // Submitters
  const { isSubmitting: isUpdating, handleUpdateProduct } = useProductSubmit(
    product,
    formData,
    selectedCategory,
    {},
    images,
    deletedImageIds,
    onClose,
    selectedSubcategoryId,
    selectedAttributeId
  );

  const { isSubmitting: isAdding, handleAddProduct } = useProductAdd(
    formData,
    selectedCategory,
    {},
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
    images,
    imagePreviewUrls,
    isSubmitting,
    handleFormChange,
    handleCategoryChange,
    handleSubcategoryChange: () => {},
    handleImageChange,
    handleRemoveImage,
    handleSubmit,
    setSelectedCategory,
    setImages,
    setImagePreviewUrls,
    setDeletedImageIds,
    selectedSubcategoryId,
    selectedAttributeId,
    handleAttributeChange,
    handleSubcatIdChange: handleSubcategoryIdChange
  };
};
