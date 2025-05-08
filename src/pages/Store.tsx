import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StoreBanner from "@/components/store/StoreBanner";
import SearchBar from "@/components/store/SearchBar";
import FilterSidebar from "@/components/store/FilterSidebar";
import ResultsHeader from "@/components/store/ResultsHeader";
import ProductGrid from "@/components/store/ProductGrid";

// Dados simulados
const categories = [
  { id: "automoveis", name: "Automóveis", subcategories: ["Esportivos", "Sedans", "SUVs", "Clássicos", "Luxo"] },
  { id: "imoveis", name: "Imóveis", subcategories: ["Mansões", "Coberturas", "Casas de Praia", "Apartamentos", "Terrenos"] },
  { id: "embarcacoes", name: "Embarcações", subcategories: ["Iates", "Veleiros", "Lanchas", "Jet Skis"] },
  { id: "aeronaves", name: "Aeronaves", subcategories: ["Jatos", "Helicópteros", "Monomotores", "Bimotores"] },
  { id: "relogios", name: "Relógios", subcategories: ["Esportivos", "Clássicos", "Edição Limitada", "Vintage"] },
  { id: "decoracao", name: "Decoração", subcategories: ["Arte", "Esculturas", "Móveis", "Itens Decorativos"] },
];

// Produtos simulados
const productsData = [
  {
    id: 1,
    name: "Mansão Beira-Mar",
    description: "Propriedade exclusiva com vista panorâmica para o mar",
    price: "R$ 12.500.000",
    category: "imoveis",
    subcategory: "Mansões",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600&h=400",
    featured: true,
  },
  {
    id: 2,
    name: "Porsche 911 Turbo S",
    description: "Motor 3.8, 650cv, 0-100 em 2.7s",
    price: "R$ 1.850.000",
    category: "automoveis",
    subcategory: "Esportivos",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600&h=400",
    featured: true,
  },
  {
    id: 3,
    name: "Iate Azimut 80",
    description: "Embarcação de luxo com 25 metros, 4 cabines",
    price: "R$ 8.200.000",
    category: "embarcacoes",
    subcategory: "Iates",
    imageUrl: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=600&h=400",
    featured: false,
  },
  {
    id: 4,
    name: "Rolex Daytona",
    description: "Relógio automático em ouro branco, edição limitada",
    price: "R$ 180.000",
    category: "relogios",
    subcategory: "Edição Limitada",
    imageUrl: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=600&h=400",
    featured: true,
  },
  {
    id: 5,
    name: "Escultura Exclusiva",
    description: "Peça única em bronze assinada por artista renomado",
    price: "R$ 95.000",
    category: "decoracao",
    subcategory: "Esculturas",
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902d1aae?auto=format&fit=crop&q=80&w=600&h=400",
    featured: false,
  },
  {
    id: 6,
    name: "Helicóptero Bell 429",
    description: "Aeronave executiva para 7 passageiros",
    price: "R$ 5.700.000",
    category: "aeronaves",
    subcategory: "Helicópteros",
    imageUrl: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=600&h=400",
    featured: false,
  },
  {
    id: 7,
    name: "Cobertura Duplex",
    description: "400m², 4 suítes, piscina e vista panorâmica",
    price: "R$ 7.200.000",
    category: "imoveis",
    subcategory: "Coberturas",
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600&h=400",
    featured: false,
  },
  {
    id: 8,
    name: "Ferrari 812 Superfast",
    description: "V12, 800cv, versão exclusiva",
    price: "R$ 4.500.000",
    category: "automoveis",
    subcategory: "Esportivos",
    imageUrl: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&q=80&w=600&h=400",
    featured: true,
  },
];

const Store = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState(productsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  // Inicializar o filtro com a categoria da URL, se houver
  useEffect(() => {
    const categoryFromUrl = searchParams.get("categoria");
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);
  
  // Filtrar produtos quando os filtros mudarem
  useEffect(() => {
    let result = productsData;
    
    // Filtrar por pesquisa
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }
    
    // Filtrar por categoria
    if (selectedCategory) {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Filtrar por subcategorias
    if (selectedSubcategories.length > 0) {
      result = result.filter(product => selectedSubcategories.includes(product.subcategory));
    }
    
    setFilteredProducts(result);
  }, [selectedCategory, selectedSubcategories, searchQuery]);
  
  // Alternar subcategoria
  const toggleSubcategory = (subcategory: string) => {
    if (selectedSubcategories.includes(subcategory)) {
      setSelectedSubcategories(selectedSubcategories.filter(s => s !== subcategory));
    } else {
      setSelectedSubcategories([...selectedSubcategories, subcategory]);
    }
  };
  
  // Selecionar categoria
  const handleCategorySelect = (categoryId: string) => {
    const newCategory = categoryId === selectedCategory ? null : categoryId;
    setSelectedCategory(newCategory);
    setSelectedSubcategories([]);
    
    // Atualizar URL
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
              categories={categories}
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
              <ResultsHeader productCount={filteredProducts.length} />
              
              {/* Exibição dos produtos filtrados */}
              <ProductGrid 
                products={filteredProducts} 
                resetFilters={resetFilters}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Store;
