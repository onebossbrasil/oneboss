import { useState, useEffect } from "react";
import { Product } from "@/types/product";

export const useCategorySelection = (product: Product | null) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategoryValues, setSubcategoryValues] = useState<Record<string, string>>({});

  // Reset categories when product changes
  useEffect(() => {
    if (product) {
      setSelectedCategory(product.categoryId || "");
      setSubcategoryValues(product.subcategoryValues || {});
    }
  }, [product]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
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
