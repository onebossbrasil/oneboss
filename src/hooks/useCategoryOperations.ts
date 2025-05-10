
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CategoryType } from "@/types/category";
import {
  fetchCategoriesData,
  createCategory,
  deleteCategory,
  createSubcategory,
  deleteSubcategory,
  addSubcategoryValue as addSubcategoryValueService,
  removeSubcategoryValue as removeSubcategoryValueService
} from "@/services/category";
import {
  groupSubcategoriesByCategory,
  groupValuesBySubcategory,
  formatCategoriesData,
} from "@/utils/categoryUtils";

export function useCategoryOperations() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setError(err.message || "Erro ao carregar categorias");
      toast({
        title: 'Erro ao carregar categorias',
        description: err.message || "Ocorreu um erro ao carregar as categorias",
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
        description: err.message || "Erro ao adicionar categoria",
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
        description: err.message || "Erro ao remover categoria",
        variant: 'destructive',
      });
      throw err;
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
        description: err.message || "Erro ao adicionar subcategoria",
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
        description: err.message || "Erro ao remover subcategoria",
        variant: 'destructive',
      });
      throw err;
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
        description: err.message || "Erro ao adicionar valor",
        variant: 'destructive',
      });
      throw err;
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
        description: err.message || "Erro ao remover valor",
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

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
