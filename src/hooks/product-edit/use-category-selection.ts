import { useState, useEffect } from "react";
import { Product } from "@/types/product";

export const useCategorySelection = (product: Product | null) => {
  // A categoryId agora SEMPRE precisa ser o uuid
  // Se vier do produto, já é uuid (product.categoryId)
  // Se vier do formulário, receba sempre o uuid da category

  const [selectedCategory, setSelectedCategory] = useState<string>(product?.categoryId ?? "");
  const [subcategoryValues, setSubcategoryValues] = useState<Record<string, string>>(product?.subcategoryValues || {});

  // Reset categories when product changes
  useEffect(() => {
    if (product) {
      setSelectedCategory(product.categoryId ?? "");
      setSubcategoryValues(product.subcategoryValues ?? {});
    } else {
      setSelectedCategory("");
      setSubcategoryValues({});
    }
    // Diagnóstico extra
    console.log("[useCategorySelection] RESET. Produto=", product);
  }, [product?.id]); // Só reseta de fato quando id muda

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSubcategoryValues({});
    // Diagnóstico: alterando categoria precisa zerar subcategorias para evitar resíduos!
    console.log("[useCategorySelection] Categoria alterada:", categoryId, "(resetou subcategoryValues)");
  };
  
  const handleSubcategoryChange = (type: string, value: string) => {
    setSubcategoryValues(prev => ({
      ...prev,
      [type]: value,
    }));
    console.log("[useCategorySelection] Subcategoria alterada:", type, value);
  };

  return {
    selectedCategory,
    subcategoryValues,
    handleCategoryChange,
    handleSubcategoryChange,
    setSelectedCategory,
    setSubcategoryValues
  };
};
