
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

  // Sincroniza selects APENAS na troca de produto (carrega dados do produto)
  useEffect(() => {
    if (product && product.id !== lastProductId.current) {
      console.log("[useProductEdit] ===== NOVO PRODUTO CARREGADO =====");
      console.log("[useProductEdit] Product ID:", product.id);
      console.log("[useProductEdit] categoryId:", product.categoryId);
      console.log("[useProductEdit] subcategoryId:", product.subcategoryId);
      console.log("[useProductEdit] attributeId (DEVE SER PRESERVADO):", product.attributeId);
      
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
      
      // Setamos os IDs diretamente do produto (valores salvos no banco)
      setSelectedCategory(product.categoryId ?? "");
      setSelectedSubcategoryId(product.subcategoryId ?? null);
      setSelectedAttributeId(product.attributeId ?? null);
      lastProductId.current = product.id;
      
      console.log("[useProductEdit] Estados setados com valores do produto salvo");
    }
    // eslint-disable-next-line
  }, [product?.id]);

  // Sincroniza selects após carregar categorias - SEMPRE PRESERVA o valor do produto
  useEffect(() => {
    if (!catLoading && categories.length > 0 && product && product.id === lastProductId.current) {
      console.log("[useProductEdit] ===== SINCRONIZANDO COM CATEGORIAS CARREGADAS =====");
      
      const cat = categories.find(cat => cat.id === product.categoryId);
      if (cat) {
        console.log("[useProductEdit] ✓ Categoria encontrada:", cat.name);
        
        const subcat = cat.subcategories.find(sc => sc.id === product.subcategoryId);
        if (subcat) {
          console.log("[useProductEdit] ✓ Subcategoria encontrada:", subcat.name);
          console.log("[useProductEdit] Atributos disponíveis:", subcat.attributes.length);
          
          // PRESERVAÇÃO PRIORITÁRIA: Se o produto tem attributeId, verifica se existe na lista
          if (product.attributeId) {
            console.log("[useProductEdit] 🔍 Verificando se attributeId do produto existe:", product.attributeId);
            
            const productAttributeExists = subcat.attributes.find(attr => attr.id === product.attributeId);
            if (productAttributeExists) {
              console.log("[useProductEdit] ✅ PRESERVANDO atributo do produto:", product.attributeId, "-", productAttributeExists.name);
              setSelectedAttributeId(product.attributeId);
            } else {
              console.log("[useProductEdit] ⚠️ Atributo do produto não encontrado na lista atual, usando primeiro disponível");
              if (subcat.attributes.length > 0) {
                setSelectedAttributeId(subcat.attributes[0].id);
              } else {
                setSelectedAttributeId(null);
              }
            }
          } else {
            console.log("[useProductEdit] ℹ️ Produto sem attributeId salvo");
            if (subcat.attributes.length > 0) {
              console.log("[useProductEdit] Selecionando primeiro atributo disponível:", subcat.attributes[0].id);
              setSelectedAttributeId(subcat.attributes[0].id);
            } else {
              console.log("[useProductEdit] Subcategoria sem atributos");
              setSelectedAttributeId(null);
            }
          }
        } else {
          console.log("[useProductEdit] ❌ Subcategoria não encontrada");
          setSelectedSubcategoryId(null);
          setSelectedAttributeId(null);
        }
      } else {
        console.log("[useProductEdit] ❌ Categoria não encontrada");
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
