
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
import { FormattedProduct } from "@/types/product";
import { useToast } from "@/hooks/use-toast";

const Store = () => {
  const { toast } = useToast();
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
  
  // Improved function to find category ID by its value
  const getCategoryIdByValue = (value: string | null) => {
    if (!value) return null;
    const category = categories.find(cat => cat.value === value);
    return category ? category.id.toString() : null;
  };
  
  // Filter products when the filters change
  useEffect(() => {
    // Log filters for debugging
    console.log("Filtering with:", {
      searchQuery,
      selectedCategory,
      selectedCategoryId: getCategoryIdByValue(selectedCategory),
      selectedSubcategories
    });
    
    // First, only include published products
    let result = products.filter(product => product.published !== false);
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query)) ||
        (product.shortDescription && product.shortDescription.toLowerCase().includes(query))
      );
    }
    
    // Filter by category (using ID)
    const selectedCategoryId = getCategoryIdByValue(selectedCategory);
    if (selectedCategoryId) {
      console.log(`Filtering by category ID: ${selectedCategoryId}`);
      result = result.filter(product => {
        console.log(`Product ${product.name} category: ${product.categoryId}, selected: ${selectedCategoryId}`);
        return product.categoryId === selectedCategoryId;
      });
    }
    
    // Filter by subcategories (improved logic)
    if (selectedSubcategories.length > 0) {
      result = result.filter(product => {
        // Skip if no subcategory values
        if (!product.subcategoryValues) return false;
        
        // Check if any of the product's subcategory values match the selected subcategories
        const productSubcategoryValues = Object.values(product.subcategoryValues);
        
        // Log for debugging
        console.log(`Product ${product.id} subcategory values:`, productSubcategoryValues, 
                    "Selected subcategories:", selectedSubcategories);
        
        // Check if any selected subcategory is in the product's values
        return selectedSubcategories.some(selected => 
          productSubcategoryValues.includes(selected)
        );
      });
    }
    
    console.log(`Filtered products: ${result.length} of ${products.length}`);
    setFilteredProducts(result);
  }, [selectedCategory, selectedSubcategories, searchQuery, products, categories]);
  
  // Toggle subcategory
  const toggleSubcategory = (subcategory: string) => {
    console.log("Toggling subcategory:", subcategory);
    if (selectedSubcategories.includes(subcategory)) {
      setSelectedSubcategories(selectedSubcategories.filter(s => s !== subcategory));
    } else {
      setSelectedSubcategories([...selectedSubcategories, subcategory]);
    }
  };
  
  // Select category
  const handleCategorySelect = (categoryId: string) => {
    const newCategory = categoryId === selectedCategory ? null : categoryId;
    console.log("Selected category value:", newCategory);
    
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
    
    toast({
      title: "Filtros limpos",
      description: "Todos os filtros foram removidos.",
    });
  };
  
  // Convert products to the format expected by ProductGrid
  const formattedProducts: FormattedProduct[] = filteredProducts.map(product => ({
    id: product.id,
    name: product.name,
    description: product.shortDescription || product.description,
    price: typeof product.price === 'number' 
      ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)
      : product.price + "",
    salePrice: product.salePrice 
      ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.salePrice)
      : undefined,
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
