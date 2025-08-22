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
  // Log inicial removido para evitar logs excessivos

  const { formData, handleFormChange, setFormData } = useFormState(product);

  // Busca categorias do contexto
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
      if (false) { // Logs removidos para evitar logs excessivos
        console.log("[AGUSTA][useProductEdit] Sincronizando dados do produto:", {
          id: product.id,
          name: product.name,
          formData: {
            name: product.name,
            shortDescription: product.shortDescription || "",
            description: product.description,
            price: product.price?.toString() || "",
            salePrice: product.salePrice?.toString() || "",
            stockQuantity: product.stockQuantity.toString(),
            published: product.published,
            featured: product.featured
          }
        });
      }
      
      setFormData({
        name: product.name,
        shortDescription: product.shortDescription || "",
        description: product.description,
        price: product.price?.toString() || "",
        salePrice: product.salePrice?.toString() || "",
        stockQuantity: product.stockQuantity.toString(),
        published: product.published,
        featured: product.featured,
        priceOnRequest: product.priceOnRequest || false
      });
      
      // Setamos os IDs diretamente do produto
      setSelectedCategory(product.categoryId ?? "");
      setSelectedSubcategoryId(product.subcategoryId ?? null);
      setSelectedAttributeId(product.attributeId ?? null);
      lastProductId.current = product.id;
      
      if (false) { // Logs removidos para evitar logs excessivos
        console.log("[AGUSTA][useProductEdit] Estados atualizados:", {
          selectedCategory: product.categoryId,
          selectedSubcategoryId: product.subcategoryId,
          selectedAttributeId: product.attributeId
        });
      }
    }
  }, [product?.id, setFormData]);

  // NOVA LÓGICA: Preservação prioritária do attributeId após categorias carregarem
  useEffect(() => {
    if (!catLoading && categories.length > 0 && product && product.id === lastProductId.current) {
      if (false) { // Logs removidos para evitar logs excessivos
        console.log("[AGUSTA][useProductEdit] Sincronizando com categorias:", {
          productId: product.id,
          categoryId: product.categoryId,
          subcategoryId: product.subcategoryId,
          attributeId: product.attributeId,
          categoriesLoaded: categories.length
        });
      }
      
      const cat = categories.find(cat => cat.id === product.categoryId);
      if (!cat) {
        console.log("[useProductEdit] ❌ Categoria não encontrada");
        return;
      }
      
      console.log("[useProductEdit] ✓ Categoria encontrada:", cat.name);
      
      const subcat = cat.subcategories.find(sc => sc.id === product.subcategoryId);
      if (!subcat) {
        console.log("[useProductEdit] ❌ Subcategoria não encontrada");
        return;
      }
      
      console.log("[useProductEdit] ✓ Subcategoria encontrada:", subcat.name);
      console.log("[useProductEdit] Atributos disponíveis na subcategoria:", subcat.attributes);
      
      // PRESERVAÇÃO PRIORITÁRIA: Se o produto tem attributeId salvo
      if (product.attributeId) {
        console.log("[useProductEdit] 🔍 TENTANDO PRESERVAR attributeId do produto:", product.attributeId);
        
        // Busca o atributo salvo na lista de atributos da subcategoria
        const savedAttribute = subcat.attributes.find(attr => {
          console.log("[useProductEdit] Comparando:", {
            attrId: attr.id,
            productAttributeId: product.attributeId,
            areEqual: attr.id === product.attributeId
          });
          return attr.id === product.attributeId;
        });
        
        if (savedAttribute) {
          console.log("[useProductEdit] ✅ PRESERVANDO atributo encontrado:", {
            id: savedAttribute.id,
            name: savedAttribute.name
          });
          setSelectedAttributeId(product.attributeId);
        } else {
          console.log("[useProductEdit] ⚠️ Atributo do produto não encontrado na lista atual");
          console.log("[useProductEdit] Atributos disponíveis:", subcat.attributes.map(a => ({ id: a.id, name: a.name })));
          
          // Fallback: primeiro atributo disponível
          if (subcat.attributes.length > 0) {
            console.log("[useProductEdit] Usando primeiro atributo como fallback:", subcat.attributes[0]);
            setSelectedAttributeId(subcat.attributes[0].id);
          } else {
            setSelectedAttributeId(null);
          }
        }
      } else {
        console.log("[useProductEdit] ℹ️ Produto sem attributeId salvo");
        // Produto novo ou sem atributo: seleciona primeiro disponível
        if (subcat.attributes.length > 0) {
          console.log("[useProductEdit] Selecionando primeiro atributo para produto novo:", subcat.attributes[0]);
          setSelectedAttributeId(subcat.attributes[0].id);
        } else {
          setSelectedAttributeId(null);
        }
      }
    }
  }, [categories, catLoading, product?.id, product?.categoryId, product?.subcategoryId, product?.attributeId]);

  // --- Handlers principais ---
  const handleCategoryChange = (categoryId: string) => {
    if (false) { // Logs removidos para evitar logs excessivos
      console.log("[AGUSTA][useProductEdit] Mudança de categoria:", {
        de: selectedCategory,
        para: categoryId
      });
    }
    setSelectedCategory(categoryId);
    setSelectedSubcategoryId(null);
    setSelectedAttributeId(null);
  };

  const handleSubcategoryIdChange = (subcategoryId: string | null) => {
    if (false) { // Logs removidos para evitar logs excessivos
      console.log("[AGUSTA][useProductEdit] Mudança de subcategoria:", {
        de: selectedSubcategoryId,
        para: subcategoryId
      });
    }
    setSelectedSubcategoryId(subcategoryId);
    setSelectedAttributeId(null);
  };

  const handleAttributeChange = (attributeId: string | null) => {
    if (false) { // Logs removidos para evitar logs excessivos
      console.log("[AGUSTA][useProductEdit] Mudança de atributo:", {
        de: selectedAttributeId,
        para: attributeId
      });
    }
    setSelectedAttributeId(attributeId);
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
