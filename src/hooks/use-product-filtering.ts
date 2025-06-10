
import { useMemo } from "react";
import { Product } from "@/types/product";

interface UseProductFilteringProps {
  products: Product[];
  searchTerm: string;
  selectedCategory: string | null;
  selectedSubcategories: any[];
  selectedAttributes: any[];
  sortOption: "relevance" | "price-asc" | "price-desc" | "newest";
  currentPage: number;
  productsPerPage: number;
}

export const useProductFiltering = ({
  products,
  searchTerm,
  selectedCategory,
  selectedSubcategories,
  selectedAttributes,
  sortOption,
  currentPage,
  productsPerPage
}: UseProductFilteringProps) => {
  // Filtro de produtos c/ busca, categoria, subcategoria, atributos + ordenação
  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      // Busca textual
      const searchMatch = searchTerm === "" || product.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Categoria - agora compara sempre ID (string)
      const categoryMatch = selectedCategory ? String(product.categoryId) === String(selectedCategory) : true;
      
      // CORREÇÃO: Subcategorias - agora trata null/undefined adequadamente
      const subcategoriesOk = selectedSubcategories.length > 0
        ? (product.subcategoryId !== null && product.subcategoryId !== undefined && 
           selectedSubcategories.some((subcat: any) => String(product.subcategoryId) === String(subcat.id)))
        : true; // Se nenhuma subcategoria selecionada, todos passam

      // CORREÇÃO: Atributos - agora trata null/undefined adequadamente
      const attributesOk = selectedAttributes.length > 0
        ? (product.attributeId !== null && product.attributeId !== undefined &&
           selectedAttributes.some((attr: any) => String(product.attributeId) === String(attr.id)))
        : true; // Se nenhum atributo selecionado, todos passam

      console.log(`[ProductFiltering] Produto: ${product.name}`, {
        searchMatch,
        categoryMatch,
        subcategoriesOk,
        attributesOk,
        productSubcategoryId: product.subcategoryId,
        productAttributeId: product.attributeId,
        selectedSubcategories: selectedSubcategories.map(s => s.id),
        selectedAttributes: selectedAttributes.map(a => a.id),
        productCategoryId: product.categoryId,
        selectedCategory,
        hasSubcategoryId: product.subcategoryId !== null && product.subcategoryId !== undefined,
        hasAttributeId: product.attributeId !== null && product.attributeId !== undefined
      });

      return searchMatch && categoryMatch && subcategoriesOk && attributesOk;
    });

    // Ordenação
    if (sortOption === "price-asc") {
      result = [...result].sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortOption === "price-desc") {
      result = [...result].sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortOption === "newest") {
      result = [...result].sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }

    console.log(`[ProductFiltering] Produtos filtrados: ${result.length} de ${products.length}`);
    console.log(`[ProductFiltering] Filtros ativos:`, {
      searchTerm,
      selectedCategory,
      selectedSubcategoriesCount: selectedSubcategories.length,
      selectedAttributesCount: selectedAttributes.length
    });
    
    return result;
  }, [products, searchTerm, selectedCategory, selectedSubcategories, selectedAttributes, sortOption]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));
  const paginatedProducts = useMemo(
    () => filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage),
    [filteredProducts, currentPage, productsPerPage]
  );

  return {
    filteredProducts,
    paginatedProducts,
    totalPages
  };
};
