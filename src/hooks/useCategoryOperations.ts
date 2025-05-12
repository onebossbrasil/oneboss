
import { useEffect, useCallback, useRef } from "react";
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

  // Track if initial load has happened
  const hasLoadedRef = useRef(false);
  // Track if component is mounted to prevent memory leaks
  const isMountedRef = useRef(true);

  // Load categories when component mounts (only once)
  useEffect(() => {
    isMountedRef.current = true;
    
    if (!hasLoadedRef.current) {
      console.log("Initial loading of categories in useCategoryOperations");
      hasLoadedRef.current = true;
      fetchCategories();
    }
    
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Optimized refresh function with debounce protection
  const refreshCategoriesCallback = useCallback(() => {
    console.log("Manual refreshing of categories requested");
    if (isMountedRef.current) {
      return fetchCategories(true); // Force refresh
    }
    return Promise.resolve();
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
