
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CategoryType } from "@/types/category";
import { fetchCategoriesData } from "@/services/category";
import {
  groupSubcategoriesByCategory,
  groupValuesBySubcategory,
  formatCategoriesData,
} from "@/utils/categoryUtils";

export function useCategoryData() {
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

  return {
    categories,
    setCategories,
    isLoading,
    setIsLoading,
    error,
    setError,
    fetchCategories,
  };
}
