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
import { FormattedProduct, Product } from "@/types/product";
import { useToast } from "@/hooks/use-toast";

// ATENÇÃO: Esta página já usa hooks para produtos/categorias vindos do Supabase.
// Apenas garantimos filtrar só published e manter a Sidebar sempre dinâmica.

const Store = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const { products, isLoading } = useProducts();
  const { categories } = useCategories();

  // FILTRAR só produtos publicados explícitos (true)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Atualiza categoria vinda da URL, se houver
  useEffect(() => {
    const categoryFromUrl = searchParams.get("categoria");
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  // Buscar ID real da categoria (por value <-> id do banco)
  const getCategoryIdByValue = (value: string | null) => {
    if (!value) return null;
    const category = categories.find(cat => cat.value === value);
    return category ? category.id.toString() : null;
  };

  // FILTRAR produtos conforme os dados vindos do Supabase e estado dos filtros
  useEffect(() => {
    // Garante que só produtos published === true entram
    let result = products.filter(product => product.published === true);

    // Filtro: busca (query textual)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product =>
        product.name.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query)) ||
        (product.shortDescription && product.shortDescription.toLowerCase().includes(query))
      );
    }

    // Filtro: categoria (usar id real da categoria)
    const selectedCategoryId = getCategoryIdByValue(selectedCategory);
    if (selectedCategoryId) {
      result = result.filter(product => product.categoryId === selectedCategoryId);
    }

    // Filtro: subcategorias (valores dinâmicos)
    if (selectedSubcategories.length > 0) {
      result = result.filter(product => {
        if (!product.subcategoryValues) return false;
        const productValues = Object.values(product.subcategoryValues);
        return selectedSubcategories.some(selected => productValues.includes(selected));
      });
    }

    setFilteredProducts(result);
  }, [selectedCategory, selectedSubcategories, searchQuery, products, categories]);

  // Atuação dos filtros do Sidebar são sempre baseados nas categorias reais do Supabase.
  // Não há código hardcoded para subcategorias, tudo consumido do contexto.

  // Toggle subcategoria
  const toggleSubcategory = (subcategory: string) => {
    if (selectedSubcategories.includes(subcategory)) {
      setSelectedSubcategories(selectedSubcategories.filter(s => s !== subcategory));
    } else {
      setSelectedSubcategories([...selectedSubcategories, subcategory]);
    }
  };

  // Selecionar categoria
  const handleCategorySelect = (categoryValue: string) => {
    const newCategory = categoryValue === selectedCategory ? null : categoryValue;
    setSelectedCategory(newCategory);
    setSelectedSubcategories([]);

    // Atualiza URL para manter sincronizado com a navegação
    if (newCategory) {
      searchParams.set("categoria", newCategory);
    } else {
      searchParams.delete("categoria");
    }
    setSearchParams(searchParams);
  };

  // Resetar filtros
  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedSubcategories([]);
    setSearchQuery("");
    searchParams.delete("categoria");
    setSearchParams(searchParams);
  };

  // Mapeamento de produtos para formato do Grid
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

  // Renderização principal
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <StoreBanner />
        <div className="container mx-auto px-4 py-8 md:py-12">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            toggleMobileFilters={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          />
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <FilterSidebar
              selectedCategory={selectedCategory}
              selectedSubcategories={selectedSubcategories}
              onCategorySelect={handleCategorySelect}
              onSubcategoryToggle={toggleSubcategory}
              isMobileFiltersOpen={isMobileFiltersOpen}
              setIsMobileFiltersOpen={setIsMobileFiltersOpen}
              resetFilters={resetFilters}
            />
            <div className="flex-grow">
              <ResultsHeader productCount={filteredProducts.length} />
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
