import React, { createContext, useContext, useCallback, useMemo } from "react";
import { CategoryType, SubcategoryType } from "@/types/category";
import { CategoryContextType } from "@/types/categoryContext";
import { useCategoryOperations } from "@/hooks/useCategoryOperations";

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    categories,
    isLoading,
    error,
    fetchCategories,
    addCategory,
    removeCategory, // agora é string
    addSubcategory,
    removeSubcategory,
    addSubcategoryValue,
    removeSubcategoryValue,
  } = useCategoryOperations();

  // Create a stable refresh function
  const refreshCategories = useCallback(() => {
    console.log("Refreshing categories from CategoryContext");
    return fetchCategories();
  }, [fetchCategories]);

  // Memoize the context value to prevent unnecessary renders
  const contextValue = useMemo(() => ({
    categories,
    isLoading,
    error,
    addCategory,
    removeCategory, // tipo correto: string
    addSubcategory,
    removeSubcategory,
    addSubcategoryValue,
    removeSubcategoryValue,
    refreshCategories
  }), [
    categories,
    isLoading,
    error,
    addCategory,
    removeCategory,
    addSubcategory,
    removeSubcategory,
    addSubcategoryValue,
    removeSubcategoryValue,
    refreshCategories
  ]);

  return (
    <CategoryContext.Provider value={contextValue}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
};

// Re-export types for convenience
export type { CategoryType, SubcategoryType } from "@/types/category";
