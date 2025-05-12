
import { useState, useCallback } from "react";
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
  const [isFetching, setIsFetching] = useState(false);

  const fetchCategories = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (isFetching) {
      console.log("Fetch already in progress, skipping");
      return;
    }
    
    try {
      setIsFetching(true);
      setIsLoading(true);
      setError(null);

      console.log("Fetching categories data...");
      const { categoriesData, subcategoriesData, valuesData } = await fetchCategoriesData();
      
      console.log(`Fetched: ${categoriesData.length} categories, ${subcategoriesData.length} subcategories, ${valuesData.length} values`);
      
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
      setIsFetching(false);
    }
  }, [toast, isFetching]);

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
