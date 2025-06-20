
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
  // Filter products with search, category, subcategory, attributes + sorting
  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      // Text search
      const searchMatch = searchTerm === "" || product.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category - compare IDs as strings
      const categoryMatch = selectedCategory ? String(product.categoryId) === String(selectedCategory) : true;
      
      // Subcategories - handle null/undefined properly
      const subcategoriesOk = selectedSubcategories.length > 0
        ? (product.subcategoryId !== null && product.subcategoryId !== undefined && 
           selectedSubcategories.some((subcat: any) => String(product.subcategoryId) === String(subcat.id)))
        : true; // If no subcategory selected, all pass

      // Attributes - handle null/undefined properly
      const attributesOk = selectedAttributes.length > 0
        ? (product.attributeId !== null && product.attributeId !== undefined &&
           selectedAttributes.some((attr: any) => String(product.attributeId) === String(attr.id)))
        : true; // If no attribute selected, all pass

      console.log(`[ProductFiltering] Product: ${product.name}`, {
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

    // Sorting
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

    console.log(`[ProductFiltering] Filtered products: ${result.length} of ${products.length}`);
    console.log(`[ProductFiltering] Active filters:`, {
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
