
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StoreBanner from "@/components/store/StoreBanner";
import SearchBar from "@/components/store/SearchBar";
import FilterSidebar from "@/components/store/FilterSidebar";
import ResultsHeader from "@/components/store/ResultsHeader";
import ProductGrid from "@/components/store/ProductGrid";
import { useProducts } from "@/contexts/ProductContext";
import { useCategories } from "@/contexts/CategoryContext";

const Store = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  const { products, isLoading } = useProducts();
  const { categories } = useCategories();
  
  const [filteredProducts, setFilteredProducts] = useState(products);
  
  // Initialize the filter with the category from the URL, if any
  useEffect(() => {
    const categoryFromUrl = searchParams.get("categoria");
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);
  
  // Filter products when the filters change
  useEffect(() => {
    let result = products;
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (selectedCategory) {
      const category = categories.find(cat => cat.value === selectedCategory);
      if (category) {
        result = result.filter(product => product.categoryId === category.id.toString());
      }
    }
    
    // Filter by subcategories
    if (selectedSubcategories.length > 0) {
      result = result.filter(product => {
        if (!product.subcategoryValues) return false;
        
        // Check if any of the product's subcategory values match the selected subcategories
        return Object.values(product.subcategoryValues).some(value => 
          selectedSubcategories.includes(value)
        );
      });
    }
    
    setFilteredProducts(result);
  }, [selectedCategory, selectedSubcategories, searchQuery, products, categories]);
  
  // Toggle subcategory
  const toggleSubcategory = (subcategory: string) => {
    if (selectedSubcategories.includes(subcategory)) {
      setSelectedSubcategories(selectedSubcategories.filter(s => s !== subcategory));
    } else {
      setSelectedSubcategories([...selectedSubcategories, subcategory]);
    }
  };
  
  // Select category
  const handleCategorySelect = (categoryId: string) => {
    const newCategory = categoryId === selectedCategory ? null : categoryId;
    setSelectedCategory(newCategory);
    setSelectedSubcategories([]);
    
    // Update URL
    if (newCategory) {
      searchParams.set("categoria", newCategory);
    } else {
      searchParams.delete("categoria");
    }
    setSearchParams(searchParams);
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedSubcategories([]);
    setSearchQuery("");
    searchParams.delete("categoria");
    setSearchParams(searchParams);
  };
  
  // Convert products to the format expected by ProductGrid
  const formattedProducts = filteredProducts.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: typeof product.price === 'number' 
      ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)
      : product.price.toString(),
    category: categories.find(cat => cat.id.toString() === product.categoryId)?.name || '',
    subcategory: Object.values(product.subcategoryValues || {}).join(', '),
    imageUrl: product.images.length > 0 ? product.images[0].url : 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=600&h=400',
    featured: product.featured,
  }));
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Banner da Loja */}
        <StoreBanner />
        
        {/* Conteúdo principal e filtros */}
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Barra de pesquisa e botão de filtro móvel */}
          <SearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            toggleMobileFilters={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          />
          
          {/* Layout principal */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Sidebar de filtros */}
            <FilterSidebar 
              selectedCategory={selectedCategory}
              selectedSubcategories={selectedSubcategories}
              onCategorySelect={handleCategorySelect}
              onSubcategoryToggle={toggleSubcategory}
              isMobileFiltersOpen={isMobileFiltersOpen}
              setIsMobileFiltersOpen={setIsMobileFiltersOpen}
            />
            
            {/* Grid de produtos */}
            <div className="flex-grow">
              {/* Contador de resultados e ordenação */}
              <ResultsHeader productCount={formattedProducts.length} />
              
              {/* Exibição dos produtos filtrados */}
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Carregando produtos...</p>
                </div>
              ) : (
                <ProductGrid 
                  products={formattedProducts} 
                  resetFilters={resetFilters}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Store;
