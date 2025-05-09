
import React, { createContext, useContext, useState, useEffect } from "react";
import { CategoryType } from "@/types/category";
import { useToast } from "@/hooks/use-toast";
import {
  fetchCategoriesData,
  createCategory,
  deleteCategory,
  createSubcategory,
  deleteSubcategory,
  addSubcategoryValue as addSubcategoryValueService,
  removeSubcategoryValue as removeSubcategoryValueService
} from "@/services/categoryService";
import {
  groupSubcategoriesByCategory,
  groupValuesBySubcategory,
  formatCategoriesData,
  findCategoryById
} from "@/utils/categoryUtils";

type CategoryContextType = {
  categories: CategoryType[];
  isLoading: boolean;
  error: string | null;
  addCategory: (name: string, value: string) => Promise<void>;
  removeCategory: (categoryId: number) => Promise<void>;
  addSubcategory: (categoryId: number, name: string, type: string) => Promise<void>;
  removeSubcategory: (categoryId: number, subcategoryId: number) => Promise<void>;
  addSubcategoryValue: (categoryId: number, subcategoryId: number, value: string) => Promise<void>;
  removeSubcategoryValue: (categoryId: number, subcategoryId: number, value: string) => Promise<void>;
  refreshCategories: () => Promise<void>;
};

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { categoriesData, subcategoriesData, valuesData } = await fetchCategoriesData();
      
      // Process the data
      const subcategoriesByCategory = groupSubcategoriesByCategory(subcategoriesData);
      const valuesBySubcategory = groupValuesBySubcategory(valuesData);
      const formattedCategories = formatCategoriesData(
        categoriesData, 
        subcategoriesByCategory, 
        valuesBySubcategory
      );

      setCategories(formattedCategories);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError(err.message);
      toast({
        title: 'Erro ao carregar categorias',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addCategory = async (name: string, value: string) => {
    try {
      setIsLoading(true);
      await createCategory(name, value);
      await fetchCategories();
      
      toast({
        title: 'Categoria adicionada',
        description: `${name} foi adicionada com sucesso.`,
      });
    } catch (err: any) {
      console.error('Error adding category:', err);
      toast({
        title: 'Erro ao adicionar categoria',
        description: err.message,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeCategory = async (categoryId: number) => {
    try {
      setIsLoading(true);
      await deleteCategory(categoryId);
      await fetchCategories();
      
      toast({
        title: 'Categoria removida',
        description: 'A categoria foi removida com sucesso.',
      });
    } catch (err: any) {
      console.error('Error removing category:', err);
      toast({
        title: 'Erro ao remover categoria',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addSubcategory = async (categoryId: number, name: string, type: string) => {
    try {
      setIsLoading(true);
      await createSubcategory(categoryId, name, type);
      await fetchCategories();
      
      toast({
        title: 'Subcategoria adicionada',
        description: `${name} foi adicionada com sucesso.`,
      });
    } catch (err: any) {
      console.error('Error adding subcategory:', err);
      toast({
        title: 'Erro ao adicionar subcategoria',
        description: err.message,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeSubcategory = async (categoryId: number, subcategoryId: number) => {
    try {
      setIsLoading(true);
      await deleteSubcategory(subcategoryId);
      await fetchCategories();
      
      toast({
        title: 'Subcategoria removida',
        description: 'A subcategoria foi removida com sucesso.',
      });
    } catch (err: any) {
      console.error('Error removing subcategory:', err);
      toast({
        title: 'Erro ao remover subcategoria',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addSubcategoryValue = async (categoryId: number, subcategoryId: number, value: string) => {
    try {
      setIsLoading(true);
      await addSubcategoryValueService(subcategoryId, value, categoryId);
      await fetchCategories();
      
      toast({
        title: 'Valor adicionado',
        description: `${value} foi adicionado com sucesso.`,
      });
    } catch (err: any) {
      console.error('Error adding subcategory value:', err);
      toast({
        title: 'Erro ao adicionar valor',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeSubcategoryValue = async (categoryId: number, subcategoryId: number, value: string) => {
    try {
      setIsLoading(true);
      await removeSubcategoryValueService(subcategoryId, value, categoryId);
      await fetchCategories();
      
      toast({
        title: 'Valor removido',
        description: `${value} foi removido com sucesso.`,
      });
    } catch (err: any) {
      console.error('Error removing subcategory value:', err);
      toast({
        title: 'Erro ao remover valor',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
