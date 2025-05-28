
import React from "react";
import { useProducts } from "@/contexts/ProductContext";
import { useCategories } from "@/contexts/CategoryContext";
import ResultsHeader from "@/components/store/ResultsHeader";
import ProductGrid from "@/components/store/ProductGrid";
import FilterSidebar from "@/components/store/FilterSidebar";
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
    isMobileFiltersOpen,
    setIsMobileFiltersOpen,
    currentPage,
    setCurrentPage,
    sortOption,
    setSortOption,
    resetFilters,
    handleCategorySelect,
    handleSubcategoryToggle
  } = useStoreFilters();

  const productsPerPage = 12;
  
  const { filteredProducts, paginatedProducts, totalPages } = useProductFiltering({
    products,
    searchTerm,
    selectedCategory,
    selectedSubcategories,
    sortOption,
    currentPage,
    productsPerPage
  });

  const hasActiveFilters = !!(searchTerm || selectedCategory || selectedSubcategories.length > 0 || sortOption !== "relevance");

  return (
    <div className="min-h-screen w-full bg-muted/50 pb-16 pt-0">
      {/* Banner visual com o título da loja */}
      <StoreBanner />

      {/* Espaçamento novo entre banner e o restante */}
      <div className="mb-8" />

      {/* Estrutura principal: sidebar + conteúdo */}
      <div className="max-w-7xl mx-auto px-2 md:px-6 flex mt-0 gap-6">
        {/* Sidebar de Filtros */}
        <div className="hidden md:block w-64 shrink-0">
          <FilterSidebar
            selectedCategory={selectedCategory}
            selectedSubcategories={selectedSubcategories}
            onCategorySelect={handleCategorySelect}
            onSubcategoryToggle={handleSubcategoryToggle}
            isMobileFiltersOpen={false}
            setIsMobileFiltersOpen={() => {}}
            resetFilters={resetFilters}
            publishedProducts={products}
          />
        </div>
        
        {/* Mobile sidebar (drawer) */}
        <div className="block md:hidden">
          <Button variant="outline" size="sm" className="mb-4" onClick={() => setIsMobileFiltersOpen(true)}>
            Filtros
          </Button>
          <FilterSidebar
            selectedCategory={selectedCategory}
            selectedSubcategories={selectedSubcategories}
            onCategorySelect={handleCategorySelect}
            onSubcategoryToggle={handleSubcategoryToggle}
            isMobileFiltersOpen={isMobileFiltersOpen}
            setIsMobileFiltersOpen={setIsMobileFiltersOpen}
            resetFilters={resetFilters}
            publishedProducts={products}
          />
        </div>
        
        {/* Conteúdo principal */}
        <main className="flex-1">
          {/* Barra de busca */}
          <StoreSearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setCurrentPage={setCurrentPage}
            hasActiveFilters={hasActiveFilters}
            resetFilters={resetFilters}
          />
          
          {/* Header de resultados e ordenação */}
          <ResultsHeader
            productCount={filteredProducts.length}
            sortOption={sortOption}
            setSortOption={setSortOption}
          />
          
          {/* Estado de carregando/erro */}
          {isLoading ? (
            <div className="text-center py-16 text-xl text-muted-foreground animate-pulse">
              Carregando produtos...
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-500">
              Erro ao carregar produtos.
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">
                Nenhum produto encontrado
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Tente ajustar os filtros ou fazer uma nova busca
              </p>
              <Button onClick={resetFilters} variant="outline">
                Limpar todos os filtros
              </Button>
            </div>
          ) : (
            <ProductGrid
              products={paginatedProducts.map(product => formatProductForGrid(product, categories))}
              resetFilters={resetFilters}
            />
          )}
          
          {/* Paginação */}
          <StorePagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </main>
      </div>
    </div>
  );
};

export default Store;
