
import { useEffect, useCallback } from "react";
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

  // Load categories when component mounts
  useEffect(() => {
    console.log("Loading categories in useCategoryOperations");
    fetchCategories();
  }, []);

  const refreshCategoriesCallback = useCallback(() => {
    console.log("Refreshing categories");
    return fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    isLoading,
    error,
    fetchCategories: refreshCategoriesCallback,
    addCategory,
    removeCategory,
    addSubcategory,
    removeSubcategory,
    addSubcategoryValue,
    removeSubcategoryValue,
  };
}
