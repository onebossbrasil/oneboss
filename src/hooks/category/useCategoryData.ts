import { useState, useCallback, useRef } from "react";
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
  const lastFetchTimeRef = useRef<number>(0);
  const MIN_FETCH_INTERVAL = 1500;

  const fetchCategories = useCallback(async (force = false) => {
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTimeRef.current;
    if (isFetching) {
      console.log("Categories fetch already in progress, skipping");
      return;
    }
    if (!force && timeSinceLastFetch < MIN_FETCH_INTERVAL) {
      console.log(`Throttling categories fetch. Last fetch was ${timeSinceLastFetch}ms ago.`);
      return;
    }
    try {
      setIsFetching(true);
      setIsLoading(true);
      setError(null);

      console.log("Fetching categories data...");
      const { categoriesData, subcategoriesData, valuesData } = await fetchCategoriesData();

      console.log(`[DEBUG] Categorias encontradas no Supabase:`, categoriesData);
      console.log(`[DEBUG] Subcategorias encontradas no Supabase:`, subcategoriesData);
      console.log(`[DEBUG] Atributos encontrados no Supabase:`, valuesData);

      // Process the data
      const subcategoriesByCategory = groupSubcategoriesByCategory(subcategoriesData);
      const valuesBySubcategory = groupValuesBySubcategory(valuesData);
      const formattedCategories = formatCategoriesData(
        categoriesData,
        subcategoriesByCategory,
        valuesBySubcategory
      );

      setCategories(formattedCategories);
      lastFetchTimeRef.current = Date.now();

      // log resultado geral
      console.log("[DEBUG] Lista final de categorias (com subcategorias):", formattedCategories);
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
  }, [toast]);

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
