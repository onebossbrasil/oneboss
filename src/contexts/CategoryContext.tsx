
import React, { createContext, useContext, useEffect } from "react";
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
    removeCategory,
    addSubcategory,
    removeSubcategory,
    addSubcategoryValue,
    removeSubcategoryValue,
  } = useCategoryOperations();

  useEffect(() => {
    fetchCategories();
  }, []);

  const refreshCategories = () => fetchCategories();

  return (
    <CategoryContext.Provider value={{
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
    }}>
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
