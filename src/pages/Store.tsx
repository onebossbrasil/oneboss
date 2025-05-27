
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "@/contexts/ProductContext";
import { useCategories } from "@/contexts/CategoryContext";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/store/CategoryFilter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Product } from "@/types/product";

const Store = () => {
  const { products, isLoading, error } = useProducts();
  const { categories } = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") || "");
  const [currentPage, setCurrentPage] = useState<number>(Number(searchParams.get("page")) || 1);
  const productsPerPage = 12;

  // === DEBUG LOGS ========
  console.log("[Store] products recebidos do contexto:", products);
  console.log("[Store] categorias disponíveis:", categories);
  console.log("[Store] selectedCategory = ", selectedCategory);
  // ========================

  useEffect(() => {
    const newParams = new URLSearchParams();
    if (searchTerm) newParams.set("search", searchTerm);
    if (selectedCategory) newParams.set("category", selectedCategory);
    if (currentPage > 1) newParams.set("page", currentPage.toString());

    setSearchParams(newParams);
  }, [searchTerm, selectedCategory, currentPage, setSearchParams]);

  // Corrigido: garantir que comparação de categoria está correta
  const filteredProducts = products.filter(product => {
    const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = selectedCategory ? String(product.categoryId) === String(selectedCategory) : true;
    return searchMatch && categoryMatch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  function formatProduct(product: Product) {
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
      subcategory: "", // Could resolve by subcategoryId if you wish
      imageUrl,
      featured: !!product.featured,
      description: product.shortDescription || product.description,
    };
  }

  const Pagination = ({
    currentPage,
    totalPages,
    onPageChange
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }) => {
    if (totalPages < 2) return null;
    return (
      <div className="flex justify-center mt-6 gap-2">
        <button
          className="rounded px-3 py-1 bg-gray-200 text-gray-700 disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Anterior
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            className={`rounded px-3 py-1 ${currentPage === idx + 1
              ? "bg-gold text-white"
              : "bg-gray-200 text-gray-700"
              }`}
            onClick={() => onPageChange(idx + 1)}
            disabled={currentPage === idx + 1}
          >
            {idx + 1}
          </button>
        ))}
        <button
          className="rounded px-3 py-1 bg-gray-200 text-gray-700 disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Próxima
        </button>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Loja</h1>
      <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-2">
        <div className="flex items-center w-full md:w-auto">
          <Input
            type="search"
            placeholder="Pesquisar produtos..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full md:w-64"
          />
          <Button variant="outline" size="icon" className="ml-2">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {isLoading ? (
        <div className="text-center">Carregando produtos...</div>
      ) : error ? (
        <div className="text-red-500 text-center">Erro ao carregar produtos.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginatedProducts.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground py-8">
                Nenhum produto encontrado.
              </div>
            )}
            {paginatedProducts.map(product => (
              <ProductCard key={product.id} product={formatProduct(product)} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default Store;

