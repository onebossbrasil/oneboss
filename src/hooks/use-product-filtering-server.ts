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
    console.log(`[ProductFilteringServer] selectedSubcategories:`, selectedSubcategories);
    console.log(`[ProductFilteringServer] selectedAttributes:`, selectedAttributes);
    
    const subcategoryIds = selectedSubcategories.map(sub => sub.id || sub);
    const attributeIds = selectedAttributes.map(attr => attr.id || attr);
    
    console.log(`[ProductFilteringServer] subcategoryIds processados:`, subcategoryIds);
    console.log(`[ProductFilteringServer] attributeIds processados:`, attributeIds);
    
    setFilters({
      search: searchTerm,
      categoryId: selectedCategory || "",
      subcategoryIds,
      attributeIds,
      sortOption
    });
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