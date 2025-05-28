
import React from "react";
import { useProducts } from "@/contexts/ProductContext";
import { useCategories } from "@/contexts/CategoryContext";
import ResultsHeader from "@/components/store/ResultsHeader";
import ProductGrid from "@/components/store/ProductGrid";
import ProductGridSkeleton from "@/components/store/ProductGridSkeleton";
import FilterSidebar from "@/components/store/FilterSidebar";
import MobileFilterSheet from "@/components/store/filter/MobileFilterSheet";
import StoreBanner from "@/components/store/StoreBanner";
import StoreSearchBar from "@/components/store/StoreSearchBar";
import StorePagination from "@/components/store/StorePagination";
import { Button } from "@/components/ui/button";
import { useStoreFilters } from "@/hooks/use-store-filters";
import { useProductFiltering } from "@/hooks/use-product-filtering";
import { formatProductForGrid } from "@/utils/store-product-formatter";

const Store = () => {
  const { products, isLoading, error } = useProducts();
  const { categories } = useCategories();
  
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    selectedSubcategories,
    selectedAttributes,
    isMobileFiltersOpen,
    setIsMobileFiltersOpen,
    currentPage,
    setCurrentPage,
    sortOption,
    setSortOption,
    resetFilters,
    handleCategorySelect,
    handleSubcategoryToggle,
    handleAttributeToggle
  } = useStoreFilters();

  const productsPerPage = 12;
  
  const { filteredProducts, paginatedProducts, totalPages } = useProductFiltering({
    products,
    searchTerm,
    selectedCategory,
    selectedSubcategories,
    selectedAttributes,
    sortOption,
    currentPage,
    productsPerPage
  });

  const hasActiveFilters = !!(searchTerm || selectedCategory || selectedSubcategories.length > 0 || selectedAttributes.length > 0 || sortOption !== "relevance");

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-muted/30 to-background pb-16 pt-0">
      {/* Banner */}
      <StoreBanner />

      {/* Container principal com padding responsivo */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 mt-8">
        
        {/* Layout: Sidebar + Conteúdo */}
        <div className="flex gap-8">
          
          {/* Sidebar Desktop */}
          <aside className="hidden lg:block w-72 xl:w-80 shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                selectedCategory={selectedCategory}
                selectedSubcategories={selectedSubcategories}
                selectedAttributes={selectedAttributes}
                onCategorySelect={handleCategorySelect}
                onSubcategoryToggle={handleSubcategoryToggle}
                onAttributeToggle={handleAttributeToggle}
                isMobileFiltersOpen={false}
                setIsMobileFiltersOpen={() => {}}
                resetFilters={resetFilters}
                publishedProducts={products}
              />
            </div>
          </aside>
          
          {/* Conteúdo Principal */}
          <main className="flex-1 min-w-0">
            
            {/* Barra de busca e filtro mobile */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1">
                <StoreSearchBar
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  setCurrentPage={setCurrentPage}
                  hasActiveFilters={hasActiveFilters}
                  resetFilters={resetFilters}
                />
              </div>
              
              {/* Mobile Filter Sheet */}
              <div className="lg:hidden">
                <MobileFilterSheet
                  selectedCategory={selectedCategory}
                  selectedSubcategories={selectedSubcategories}
                  selectedAttributes={selectedAttributes}
                  onCategorySelect={handleCategorySelect}
                  onSubcategoryToggle={handleSubcategoryToggle}
                  onAttributeToggle={handleAttributeToggle}
                  resetFilters={resetFilters}
                  publishedProducts={products}
                  isOpen={isMobileFiltersOpen}
                  onOpenChange={setIsMobileFiltersOpen}
                />
              </div>
            </div>
            
            {/* Header de resultados */}
            <ResultsHeader
              productCount={filteredProducts.length}
              sortOption={sortOption}
              setSortOption={setSortOption}
            />
            
            {/* Estados de carregamento/erro */}
            {isLoading ? (
              <ProductGridSkeleton />
            ) : error ? (
              <div className="text-center py-16">
                <div className="text-red-500 text-lg mb-4">
                  Erro ao carregar produtos
                </div>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Tentar novamente
                </Button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground mb-4">
                  Nenhum produto encontrado
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Tente ajustar os filtros ou fazer uma nova busca
                </p>
                <Button onClick={resetFilters} variant="outline" className="border-gold text-gold hover:bg-gold/10">
                  Limpar todos os filtros
                </Button>
              </div>
            ) : (
              <ProductGrid
                products={paginatedProducts.map(product => formatProductForGrid(product, categories))}
                resetFilters={resetFilters}
                isLoading={isLoading}
              />
            )}
            
            {/* Paginação */}
            {!isLoading && filteredProducts.length > 0 && (
              <StorePagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Store;
