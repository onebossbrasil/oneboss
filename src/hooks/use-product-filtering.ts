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
    console.log(`[ProductFiltering] ===== INICIANDO FILTRAGEM =====`);
    console.log(`[ProductFiltering] Total de produtos:`, products.length);
    console.log(`[ProductFiltering] Filtros ativos:`, {
      searchTerm,
      selectedCategory,
      selectedSubcategoriesCount: selectedSubcategories.length,
      selectedAttributesCount: selectedAttributes.length,
      sortOption
    });

    // Debug: mostrar alguns produtos para entender a estrutura
    if (products.length > 0) {
      console.log(`[ProductFiltering] Estrutura do primeiro produto:`, {
        id: products[0].id,
        name: products[0].name,
        categoryId: products[0].categoryId,
        subcategoryId: products[0].subcategoryId,
        attributeId: products[0].attributeId,
        categoryIdType: typeof products[0].categoryId,
        published: products[0].published
      });
    }

    let result = products.filter(product => {
      // 1. Text search
      const searchMatch = searchTerm === "" || 
        (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // 2. Category filtering - mais robusto
      let categoryMatch = true;
      if (selectedCategory) {
        // Converte ambos para string e remove espaços
        const productCategoryId = String(product.categoryId || "").trim();
        const selectedCategoryId = String(selectedCategory).trim();
        categoryMatch = productCategoryId === selectedCategoryId;
        
        // Debug para categoria específica
        if (!categoryMatch) {
          console.log(`[ProductFiltering] Categoria não match:`, {
            productName: product.name,
            productCategoryId: `"${productCategoryId}"`,
            selectedCategoryId: `"${selectedCategoryId}"`,
            productCategoryIdLength: productCategoryId.length,
            selectedCategoryIdLength: selectedCategoryId.length
          });
        }
      }
      
      // 3. Subcategories filtering
      let subcategoriesOk = true;
      if (selectedSubcategories.length > 0) {
        if (product.subcategoryId === null || product.subcategoryId === undefined) {
          subcategoriesOk = false;
        } else {
          subcategoriesOk = selectedSubcategories.some((subcat: any) => 
            String(product.subcategoryId).trim() === String(subcat.id).trim()
          );
        }
      }

      // 4. Attributes filtering
      let attributesOk = true;
      if (selectedAttributes.length > 0) {
        if (product.attributeId === null || product.attributeId === undefined) {
          attributesOk = false;
        } else {
          attributesOk = selectedAttributes.some((attr: any) => 
            String(product.attributeId).trim() === String(attr.id).trim()
          );
        }
      }

      // 5. Published filter (só produtos publicados)
      const publishedOk = product.published === true;

      const passes = searchMatch && categoryMatch && subcategoriesOk && attributesOk && publishedOk;

      // Log detalhado apenas para produtos que não passaram e temos filtros ativos
      if (!passes && (searchTerm || selectedCategory || selectedSubcategories.length > 0 || selectedAttributes.length > 0)) {
        console.log(`[ProductFiltering] ❌ Produto rejeitado: "${product.name}"`, {
          searchMatch,
          categoryMatch,
          subcategoriesOk,
          attributesOk,
          publishedOk,
          productCategoryId: product.categoryId,
          selectedCategory,
          productSubcategoryId: product.subcategoryId,
          productAttributeId: product.attributeId
        });
      }

      return passes;
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

    console.log(`[ProductFiltering] ===== RESULTADO FINAL =====`);
    console.log(`[ProductFiltering] Produtos filtrados: ${result.length} de ${products.length}`);
    
    // Se há categoria selecionada mas 0 resultados, investigar
    if (selectedCategory && result.length === 0) {
      console.log(`[ProductFiltering] 🚨 PROBLEMA: Categoria "${selectedCategory}" selecionada mas 0 produtos encontrados!`);
      console.log(`[ProductFiltering] Produtos com essa categoria:`, 
        products.filter(p => String(p.categoryId).trim() === String(selectedCategory).trim())
          .map(p => ({ name: p.name, categoryId: p.categoryId, published: p.published }))
      );
    }
    
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
