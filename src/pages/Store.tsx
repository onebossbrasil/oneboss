
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "@/contexts/ProductContext";
import { useCategories } from "@/contexts/CategoryContext";
import StoreHeader from "@/components/store/StoreHeader";
import ResultsHeader from "@/components/store/ResultsHeader";
import CategoryFilter from "@/components/store/CategoryFilter";
import ProductGrid from "@/components/store/ProductGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw } from "lucide-react";

const Store = () => {
  const { products, isLoading, error } = useProducts();
  const { categories } = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") || "");
  const [currentPage, setCurrentPage] = useState<number>(Number(searchParams.get("page")) || 1);

  // Ordenação — pode ser expandido depois
  const [sortOption, setSortOption] = useState<"relevance"|"price-asc"|"price-desc"|"newest">(searchParams.get("sort") as any || "relevance");

  const productsPerPage = 12;

  // Sincronizar estado->URL (query string)
  useEffect(() => {
    const newParams = new URLSearchParams();
    if (searchTerm) newParams.set("search", searchTerm);
    if (selectedCategory) newParams.set("category", selectedCategory);
    if (currentPage > 1) newParams.set("page", currentPage.toString());
    if (sortOption && sortOption !== "relevance") newParams.set("sort", sortOption);
    setSearchParams(newParams, { replace: true });
    // eslint-disable-next-line
  }, [searchTerm, selectedCategory, currentPage, sortOption]);

  // Função para resetar filtro/busca/página
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setCurrentPage(1);
    setSortOption("relevance");
  };

  // Tratamento de busca/filter
  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      const searchMatch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const categoryMatch = selectedCategory ? String(product.categoryId) === String(selectedCategory) : true;
      return searchMatch && categoryMatch;
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
    return result;
  }, [products, searchTerm, selectedCategory, sortOption]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));
  const paginatedProducts = useMemo(
    () => filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage),
    [filteredProducts, currentPage, productsPerPage]
  );

  // Format product for Grid
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
      subcategory: "", // Pode adicionar subcategoria resolvida aqui depois
      imageUrl,
      featured: !!product.featured,
      description: product.shortDescription || product.description,
    };
  }

  // Busca: submit com Enter ou clique
  const onSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  // Cabeçalho de busca+filtro
  const showClearButton = !!searchTerm || !!selectedCategory || sortOption !== "relevance";

  return (
    <div className="min-h-screen bg-muted/50 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <StoreHeader />
        {/* Barra de busca e filtros */}
        <form onSubmit={onSearch} className="flex flex-col md:flex-row items-center gap-2 mb-7">
          <div className="relative w-full md:w-4/12">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar produtos..."
              className="pl-9 rounded-r-none"
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              autoFocus
            />
          </div>
          <span className="hidden md:block w-5" />
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={catId => { setSelectedCategory(catId); setCurrentPage(1); }}
          />
          {showClearButton && (
            <Button
              type="button"
              variant="ghost"
              className="ml-2 text-muted-foreground"
              onClick={resetFilters}
            >
              <RefreshCw className="w-4 h-4 mr-1" />
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
      </div>
    </div>
  );
};

export default Store;
