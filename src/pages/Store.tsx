
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, Search, Filter, Slider } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import ProductCard from "@/components/ProductCard";

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
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600&h=400",
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
  
  // Obter subcategorias para a categoria selecionada
  const getSubcategories = () => {
    if (!selectedCategory) return [];
    const category = categories.find(cat => cat.id === selectedCategory);
    return category ? category.subcategories : [];
  };
  
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Banner da Loja */}
        <div className="relative bg-black/90 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
              Loja <span className="text-gold">Premium</span>
            </h1>
            <p className="text-white/80 max-w-xl mx-auto">
              Descubra produtos exclusivos selecionados para uma experiência extraordinária
            </p>
          </div>
        </div>
        
        {/* Conteúdo principal e filtros */}
        <div className="container mx-auto px-4 py-12">
          {/* Barra de pesquisa e botão de filtro móvel */}
          <div className="flex items-center justify-between mb-8 gap-4">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Buscar produtos..."
                className="pl-10 border-gold/20 focus-visible:ring-gold/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="md:hidden border-gold/30 text-gold"
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            >
              <Filter className="h-5 w-5 mr-2" />
              Filtros
            </Button>
          </div>
          
          {/* Layout principal */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar de filtros */}
            <aside 
              className={`md:w-64 flex-shrink-0 glassmorphism p-6 rounded-lg self-start sticky top-24 transition-all duration-300 ${isMobileFiltersOpen ? 'block' : 'hidden md:block'}`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg">Filtros</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="md:hidden text-muted-foreground"
                  onClick={() => setIsMobileFiltersOpen(false)}
                >
                  ✕
                </Button>
              </div>
              
              {/* Filtro por categoria */}
              <div className="space-y-4 mb-6">
                <h3 className="font-medium">Categorias</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex flex-col">
                      <Button
                        variant="ghost"
                        className={`justify-start font-normal ${selectedCategory === category.id ? 'bg-gold/10 text-gold' : ''}`}
                        onClick={() => handleCategorySelect(category.id)}
                      >
                        {category.name}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator className="my-6" />
              
              {/* Filtro por subcategoria */}
              {selectedCategory && (
                <div className="space-y-4">
                  <h3 className="font-medium">Subcategorias</h3>
                  <div className="space-y-3">
                    {getSubcategories().map((subcategory) => (
                      <div key={subcategory} className="flex items-center space-x-2">
                        <Checkbox 
                          id={subcategory} 
                          checked={selectedSubcategories.includes(subcategory)}
                          onCheckedChange={() => toggleSubcategory(subcategory)}
                          className="border-gold/40 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                        />
                        <label 
                          htmlFor={subcategory}
                          className="text-sm cursor-pointer"
                        >
                          {subcategory}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Botão para aplicar filtros (apenas mobile) */}
              <div className="mt-8 md:hidden">
                <Button 
                  className="w-full bg-gold hover:bg-gold-light text-white"
                  onClick={() => setIsMobileFiltersOpen(false)}
                >
                  Aplicar Filtros
                </Button>
              </div>
            </aside>
            
            {/* Grid de produtos */}
            <div className="flex-grow">
              {/* Contador de resultados e ordenação */}
              <div className="flex justify-between items-center mb-8">
                <p className="text-sm text-muted-foreground">
                  {filteredProducts.length} produtos encontrados
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Ordenar por:</span>
                  <select className="text-sm border-gold/20 rounded p-1 bg-transparent">
                    <option value="relevance">Relevância</option>
                    <option value="price-asc">Menor preço</option>
                    <option value="price-desc">Maior preço</option>
                    <option value="newest">Mais recentes</option>
                  </select>
                </div>
              </div>
              
              {/* Exibição dos produtos filtrados */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-lg text-muted-foreground">Nenhum produto encontrado</p>
                  <Button 
                    variant="outline" 
                    className="mt-4 border-gold/30 text-gold"
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedSubcategories([]);
                      setSearchQuery("");
                      searchParams.delete("categoria");
                      setSearchParams(searchParams);
                    }}
                  >
                    Limpar filtros
                  </Button>
                </div>
              )}
              
              {/* Paginação */}
              {filteredProducts.length > 0 && (
                <div className="mt-12 flex justify-center">
                  <div className="flex space-x-2">
                    <Button variant="outline" disabled className="text-muted-foreground">
                      1
                    </Button>
                    <Button variant="ghost">2</Button>
                    <Button variant="ghost">3</Button>
                    <Button variant="ghost">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
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
