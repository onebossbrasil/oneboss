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
      setSelectedCategory(product.categoryId || "");
      setSubcategoryValues(product.subcategoryValues || {});
    }
  }, [product]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Keep the featured status but reset other subcategory values
    const featured = subcategoryValues.featured;
    setSubcategoryValues(featured ? { featured } : {});
  };
  
  const handleSubcategoryChange = (type: string, value: string) => {
    setSubcategoryValues(prev => ({
      ...prev,
      [type]: value
    }));
  };

  return {
    selectedCategory,
    subcategoryValues,
    handleCategoryChange,
    handleSubcategoryChange
  };
};
