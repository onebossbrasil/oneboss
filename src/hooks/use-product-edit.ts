
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
      console.log("[useProductEdit] Novo produto carregado:", product.id);
      console.log("[useProductEdit] Dados do produto - categoryId:", product.categoryId, "subcategoryId:", product.subcategoryId, "attributeId:", product.attributeId);
      
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
      
      console.log("[useProductEdit] Estados setados - categoria:", product.categoryId, "subcategoria:", product.subcategoryId, "atributo:", product.attributeId);
    }
    // eslint-disable-next-line
  }, [product?.id]);

  // Sincroniza selects após carregar categorias - PRESERVA o valor do produto
  useEffect(() => {
    if (!catLoading && categories.length > 0 && product && product.id === lastProductId.current) {
      console.log("[useProductEdit] Sincronizando com categorias carregadas...");
      
      const cat = categories.find(cat => cat.id === product.categoryId);
      if (cat) {
        console.log("[useProductEdit] Categoria encontrada:", cat.name);
        setSelectedCategory(product.categoryId ?? "");
        
        const subcat = cat.subcategories.find(sc => sc.id === product.subcategoryId);
        if (subcat) {
          console.log("[useProductEdit] Subcategoria encontrada:", subcat.name, "com", subcat.attributes.length, "atributos");
          setSelectedSubcategoryId(product.subcategoryId ?? null);
          
          // CORREÇÃO PRINCIPAL: Preservar o attributeId do produto se ele existir na lista
          if (product.attributeId && subcat.attributes.length > 0) {
            const attrExists = subcat.attributes.find(at => at.id === product.attributeId);
            if (attrExists) {
              console.log("[useProductEdit] Preservando atributo do produto:", product.attributeId, ":", attrExists.name);
              setSelectedAttributeId(product.attributeId);
            } else {
              console.log("[useProductEdit] Atributo do produto não encontrado na lista, usando primeiro disponível");
              setSelectedAttributeId(subcat.attributes[0].id);
            }
          } else if (subcat.attributes.length > 0) {
            console.log("[useProductEdit] Produto sem atributo, selecionando primeiro disponível");
            setSelectedAttributeId(subcat.attributes[0].id);
          } else {
            console.log("[useProductEdit] Subcategoria sem atributos");
            setSelectedAttributeId(null);
          }
        } else {
          console.log("[useProductEdit] Subcategoria não encontrada");
          setSelectedSubcategoryId(null);
          setSelectedAttributeId(null);
        }
      } else {
        console.log("[useProductEdit] Categoria não encontrada");
        setSelectedCategory("");
        setSelectedSubcategoryId(null);
        setSelectedAttributeId(null);
      }
    }
    // eslint-disable-next-line
  }, [categories, catLoading, product?.id, product?.categoryId, product?.subcategoryId, product?.attributeId]);

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
    setDeletedImageIds,
    errorMsg,
    isUploading
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
    handleSubcatIdChange: handleSubcategoryIdChange,
    errorMsg,
    isUploading
  };
};
