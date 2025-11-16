import { useMemo, useEffect } from "react";
import { useStoreProducts } from "@/contexts/product/StoreProductProvider";

interface UseProductFilteringServerProps {
  searchTerm: string;
  selectedCategory: string | null;
  selectedSubcategories: any[];
  selectedAttributes: any[];
  sortOption: "relevance" | "price-asc" | "price-desc" | "newest";
  currentPage: number;
  productsPerPage: number;
}

export const useProductFilteringServer = ({
  searchTerm,
  selectedCategory,
  selectedSubcategories,
  selectedAttributes,
  sortOption,
  currentPage,
  productsPerPage
}: UseProductFilteringServerProps) => {
  const { 
    products, 
    setFilters, 
    totalPages, 
    totalCount,
    setCurrentPage,
    isLoading 
  } = useStoreProducts();

  // Sincroniza filtros com o provider - usando useEffect para garantir execução
  useEffect(() => {
    console.log(`[ProductFilteringServer] ===== SINCRONIZANDO FILTROS =====`);
    console.log(`[ProductFilteringServer] searchTerm:`, searchTerm);
    console.log(`[ProductFilteringServer] selectedCategory:`, selectedCategory);
    console.log(`[ProductFilteringServer] selectedSubcategories:`, selectedSubcategories);
    console.log(`[ProductFilteringServer] selectedAttributes:`, selectedAttributes);
    console.log(`[ProductFilteringServer] sortOption:`, sortOption);
    
    const subcategoryIds = selectedSubcategories.map(sub => sub.id || sub);
    const attributeIds = selectedAttributes.map(attr => attr.id || attr);
    
    console.log(`[ProductFilteringServer] subcategoryIds processados:`, subcategoryIds);
    console.log(`[ProductFilteringServer] attributeIds processados:`, attributeIds);
    
    const filters = {
      search: searchTerm,
      categoryId: selectedCategory || "",
      subcategoryIds,
      attributeIds,
      sortOption
    };
    
    console.log(`[ProductFilteringServer] Enviando filtros para provider:`, filters);
    setFilters(filters);
  }, [searchTerm, selectedCategory, selectedSubcategories, selectedAttributes, sortOption, setFilters]);

  // Sincroniza página
  useMemo(() => {
    setCurrentPage(currentPage);
  }, [currentPage, setCurrentPage]);

  // Para compatibilidade com a interface atual
  const filteredProducts = products;
  const paginatedProducts = products;

  console.log(`[ProductFilteringServer] ===== RESULTADO FINAL =====`);
  console.log(`[ProductFilteringServer] Produtos na página: ${products.length}, Total: ${totalCount}, Página: ${currentPage}/${totalPages}`);

  return {
    filteredProducts,
    paginatedProducts,
    totalPages,
    totalCount,
    isLoading
  };
};