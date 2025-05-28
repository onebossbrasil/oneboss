
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useCategories } from "@/contexts/CategoryContext";

export const useStoreFilters = () => {
  const { categories } = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();

  // Busca, filtro
  const paramCategory = searchParams.get("category");
  const initCategoryId =
    categories.find(c => c.id === paramCategory) // já é id
      ? paramCategory
      : categories.find(c => c.value === paramCategory)?.id || "";

  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initCategoryId || null);
  const [selectedSubcategories, setSelectedSubcategories] = useState<any[]>([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(Number(searchParams.get("page")) || 1);
  const [sortOption, setSortOption] = useState<"relevance"|"price-asc"|"price-desc"|"newest">(searchParams.get("sort") as any || "relevance");

  // Sincronizar parâmetros de busca/filtro com a URL
  useEffect(() => {
    const newParams = new URLSearchParams();
    if (searchTerm) newParams.set("search", searchTerm);
    if (selectedCategory) newParams.set("category", selectedCategory);
    if (selectedSubcategories.length > 0) newParams.set("subcategories", selectedSubcategories.map(s => s.id).join(","));
    if (currentPage > 1) newParams.set("page", currentPage.toString());
    if (sortOption && sortOption !== "relevance") newParams.set("sort", sortOption);
    setSearchParams(newParams, { replace: true });
    // eslint-disable-next-line
  }, [searchTerm, selectedCategory, selectedSubcategories, currentPage, sortOption]);

  // Limpa todos filtros
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setSelectedSubcategories([]);
    setCurrentPage(1);
    setSortOption("relevance");
  };

  // Handlers sidebar
  const handleCategorySelect = (catId: string | null) => {
    console.log(`[Store] Categoria selecionada: ${catId}`);
    setSelectedCategory(catId);
    setSelectedSubcategories([]);
    setCurrentPage(1);
  };
  
  const handleSubcategoryToggle = (subcat: any) => {
    console.log(`[Store] Toggle subcategoria:`, subcat);
    setSelectedSubcategories(prev => {
      const isAlreadySelected = prev.some((sc: any) => sc.id === subcat.id);
      const newSelection = isAlreadySelected
        ? prev.filter((sc: any) => sc.id !== subcat.id)
        : [...prev, subcat];
      
      console.log(`[Store] Nova seleção de subcategorias:`, newSelection);
      return newSelection;
    });
    setCurrentPage(1);
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    selectedSubcategories,
    isMobileFiltersOpen,
    setIsMobileFiltersOpen,
    currentPage,
    setCurrentPage,
    sortOption,
    setSortOption,
    resetFilters,
    handleCategorySelect,
    handleSubcategoryToggle
  };
};
