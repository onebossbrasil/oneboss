
import { useEffect } from "react";
import { useCategoryData, useCategoryMutations, useSubcategoryMutations, useSubcategoryValueMutations } from "@/hooks/category";

export function useCategoryOperations() {
  const {
    categories,
    isLoading,
    error,
    setIsLoading,
    fetchCategories
  } = useCategoryData();

  const {
    addCategory,
    removeCategory
  } = useCategoryMutations(setIsLoading, fetchCategories);

  const {
    addSubcategory,
    removeSubcategory
  } = useSubcategoryMutations(setIsLoading, fetchCategories);

  const {
    addSubcategoryValue,
    removeSubcategoryValue
  } = useSubcategoryValueMutations(setIsLoading, fetchCategories);

  return {
    categories,
    isLoading,
    error,
    fetchCategories,
    addCategory,
    removeCategory,
    addSubcategory,
    removeSubcategory,
    addSubcategoryValue,
    removeSubcategoryValue,
  };
}
