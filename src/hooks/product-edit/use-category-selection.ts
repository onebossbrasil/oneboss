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
    // Corrigido: sincroniza SEMPRE com o produto, inclusive em edição reaberta
    if (product) {
      setSelectedCategory(product.categoryId ?? "");
      setSubcategoryValues(product.subcategoryValues ?? {});
    } else {
      setSelectedCategory("");
      setSubcategoryValues({});
    }
  }, [product?.id]); // Só reseta de fato quando id muda

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Mantém featured se existir
    const featured = subcategoryValues.featured;
    setSubcategoryValues(featured ? { featured } : {});
  };
  
  const handleSubcategoryChange = (type: string, value: string) => {
    setSubcategoryValues(prev => ({
      ...prev,
      [type]: value,
    }));
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
