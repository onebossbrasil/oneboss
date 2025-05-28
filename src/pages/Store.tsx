
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "@/contexts/ProductContext";
import { useCategories } from "@/contexts/CategoryContext";
import StoreHeader from "@/components/store/StoreHeader";
import ResultsHeader from "@/components/store/ResultsHeader";
import ProductGrid from "@/components/store/ProductGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import FilterSidebar from "@/components/store/FilterSidebar";

const Store = () => {
  const { products, isLoading, error } = useProducts();
  const { categories } = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();

  // Busca, filtro
  // Garanta que pegamos sempre o `id` da categoria.
  const paramCategory = searchParams.get("category");
  const initCategoryId =
    categories.find(c => c.id === paramCategory) // já é id
      ? paramCategory
      : categories.find(c => c.value === paramCategory)?.id || "";

  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initCategoryId || null);
  const [selectedSubcategories, setSelectedSubcategories] = useState<any[]>([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(Number(searchParams.get("page")) || 1);

  // Ordenação
  const [sortOption, setSortOption] = useState<"relevance"|"price-asc"|"price-desc"|"newest">(searchParams.get("sort") as any || "relevance");

  const productsPerPage = 12;

  // Sincronizar parâmetros de busca/filtro com a URL
  useEffect(() => {
    const newParams = new URLSearchParams();
    if (searchTerm) newParams.set("search", searchTerm);
    if (selectedCategory) newParams.set("category", selectedCategory);
    if (selectedSubcategories.length > 0) newParams.set("subcategories", selectedSubcategories.map(s => s.id).join(","));
    if (currentPage > 1) newParams.set("page", currentPage.toString());
    if (sortOption && sortOption !== "relevance") newParams.set("sort", sortOption);
    setSearchParams(newParams, { replace: true });
    // eslint-disable-next-line
  }, [searchTerm, selectedCategory, selectedSubcategories, currentPage, sortOption]);

  // Limpa todos filtros
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setSelectedSubcategories([]);
    setCurrentPage(1);
    setSortOption("relevance");
  };

  // Filtro de produtos c/ busca, categoria, subcategoria + ordenação
  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      // Busca textual
      const searchMatch = searchTerm === "" || product.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Categoria - agora compara sempre ID (string)
      const categoryMatch = selectedCategory ? String(product.categoryId) === String(selectedCategory) : true;
      
      // CORREÇÃO: Subcategorias - agora usa subcategoryId em vez de attributeId
      const subcategoriesOk = selectedSubcategories.length > 0
        ? selectedSubcategories.some((subcat: any) => String(product.subcategoryId) === String(subcat.id))
        : true;

      console.log(`[Store] Produto: ${product.name}`, {
        searchMatch,
        categoryMatch,
        subcategoriesOk,
        productSubcategoryId: product.subcategoryId,
        selectedSubcategories: selectedSubcategories.map(s => s.id),
        productCategoryId: product.categoryId,
        selectedCategory
      });

      return searchMatch && categoryMatch && subcategoriesOk;
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

    console.log(`[Store] Produtos filtrados: ${result.length} de ${products.length}`);
    return result;
  }, [products, searchTerm, selectedCategory, selectedSubcategories, sortOption]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));
  const paginatedProducts = useMemo(
    () => filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage),
    [filteredProducts, currentPage, productsPerPage]
  );

  // Format product para o Grid
  function formatProduct(product) {
    const categoryName = categories.find(cat => String(cat.id) === String(product.categoryId))?.name || "";
    let price: string;
    if (typeof product.price === "number") {
      price = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.price);
    } else if (typeof product.price === "string") {
      price = product.price;
    } else {
      price = "";
    }
    const imageUrl =
      product.images?.[0]?.url ||
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600&h=400";
    return {
      id: product.id,
      name: product.name,
      price,
      salePrice:
        product.salePrice && typeof product.salePrice === "number"
          ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.salePrice)
          : undefined,
      category: categoryName,
      subcategory: "",
      imageUrl,
      featured: !!product.featured,
      description: product.shortDescription || product.description,
    };
  }

  // Handlers sidebar
  const handleCategorySelect = (catId: string | null) => {
    console.log(`[Store] Categoria selecionada: ${catId}`);
    setSelectedCategory(catId);
    setSelectedSubcategories([]);
    setCurrentPage(1);
  };
  
  const handleSubcategoryToggle = (subcat: any) => {
    console.log(`[Store] Toggle subcategoria:`, subcat);
    setSelectedSubcategories(prev => {
      const isAlreadySelected = prev.some((sc: any) => sc.id === subcat.id);
      const newSelection = isAlreadySelected
        ? prev.filter((sc: any) => sc.id !== subcat.id)
        : [...prev, subcat];
      
      console.log(`[Store] Nova seleção de subcategorias:`, newSelection);
      return newSelection;
    });
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen w-full bg-muted/50 pb-16 pt-0">
      {/* Banner visual com o título da loja */}
      <div className="w-full relative h-[220px] md:h-[340px] flex items-center justify-center bg-gradient-to-br from-gold/80 via-gold/40 to-muted rounded-b-3xl mb-0 shadow-lg overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80"
          alt="Banner loja"
          className="absolute inset-0 object-cover w-full h-full opacity-35 z-0"
          draggable={false}
        />
        <div className="relative z-10 text-center">
          <h1 className="font-playfair text-white text-4xl md:text-6xl font-bold drop-shadow mb-2 tracking-tight uppercase">Loja</h1>
          <p className="text-white/90 max-w-lg mx-auto text-sm md:text-lg drop-shadow-sm">
            Explore nosso catálogo de produtos exclusivos. Filtre e encontre o que precisa!
          </p>
        </div>
      </div>

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
          <form onSubmit={e => { e.preventDefault(); setCurrentPage(1); }} className="w-full flex items-center gap-2 mb-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar produtos..."
                className="pl-9"
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                autoFocus
              />
            </div>
            { (!!searchTerm || !!selectedCategory || selectedSubcategories.length > 0 || sortOption !== "relevance") && (
              <Button
                type="button"
                variant="ghost"
                className="text-muted-foreground"
                onClick={resetFilters}
              >
                Limpar filtros
              </Button>
            )}
          </form>
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
              products={paginatedProducts.map(formatProduct)}
              resetFilters={resetFilters}
            />
          )}
          {/* Paginação */}
          <div className="mt-8">
            {totalPages > 1 && (
              <nav className="flex justify-center">
                {Array.from({ length: totalPages }, (_, idx) => (
                  <Button
                    key={idx}
                    size="sm"
                    variant={currentPage === idx + 1 ? "default" : "outline"}
                    className={`mx-1 ${currentPage === idx + 1 ? "font-bold" : ""}`}
                    onClick={() => setCurrentPage(idx + 1)}
                    disabled={currentPage === idx + 1}
                  >
                    {idx + 1}
                  </Button>
                ))}
              </nav>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Store;
