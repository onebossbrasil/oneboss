import { useState, useEffect, useCallback } from "react";
import { 
  fetchCategoryCounters, 
  fetchSubcategoryCounters, 
  fetchAttributeCounters,
  CategoryCounter,
  SubcategoryCounter,
  AttributeCounter
} from "@/utils/product/category-counters";

export const useCategoryCounters = () => {
  const [categoryCounters, setCategoryCounters] = useState<CategoryCounter[]>([]);
  const [subcategoryCounters, setSubcategoryCounters] = useState<SubcategoryCounter[]>([]);
  const [attributeCounters, setAttributeCounters] = useState<AttributeCounter[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Carrega contadores de categorias
  const loadCategoryCounters = useCallback(async () => {
    setIsLoading(true);
    const { categoryCounters, error } = await fetchCategoryCounters();
    if (!error) {
      setCategoryCounters(categoryCounters);
    }
    setIsLoading(false);
  }, []);

  // Carrega contadores de subcategorias para uma categoria
  const loadSubcategoryCounters = useCallback(async (categoryId: string) => {
    const { subcategoryCounters, error } = await fetchSubcategoryCounters(categoryId);
    if (!error) {
      setSubcategoryCounters(subcategoryCounters);
    }
  }, []);

  // Carrega contadores de atributos para uma subcategoria
  const loadAttributeCounters = useCallback(async (subcategoryId: string) => {
    const { attributeCounters, error } = await fetchAttributeCounters(subcategoryId);
    if (!error) {
      setAttributeCounters(attributeCounters);
    }
  }, []);

  // Funções para obter contadores específicos
  const getProductCountForCategory = useCallback((categoryId: string): number => {
    const counter = categoryCounters.find(c => c.categoryId === categoryId);
    return counter ? counter.count : 0;
  }, [categoryCounters]);

  const getProductCountForSubcategory = useCallback((subcategoryId: string): number => {
    const counter = subcategoryCounters.find(c => c.subcategoryId === subcategoryId);
    return counter ? counter.count : 0;
  }, [subcategoryCounters]);

  const getProductCountForAttribute = useCallback((attributeId: string): number => {
    const counter = attributeCounters.find(c => c.attributeId === attributeId);
    return counter ? counter.count : 0;
  }, [attributeCounters]);

  // Carrega contadores de categorias na inicialização
  useEffect(() => {
    loadCategoryCounters();
  }, [loadCategoryCounters]);

  return {
    categoryCounters,
    subcategoryCounters,
    attributeCounters,
    isLoading,
    loadCategoryCounters,
    loadSubcategoryCounters,
    loadAttributeCounters,
    getProductCountForCategory,
    getProductCountForSubcategory,
    getProductCountForAttribute
  };
};