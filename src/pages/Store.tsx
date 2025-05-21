
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "@/contexts/ProductContext";
import { useCategories } from "@/contexts/CategoryContext";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/store/CategoryFilter";
import { Pagination } from "@/components/ui/pagination";
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

  useEffect(() => {
    const newParams = new URLSearchParams();
    if (searchTerm) newParams.set("search", searchTerm);
    if (selectedCategory) newParams.set("category", selectedCategory);
    if (currentPage > 1) newParams.set("page", currentPage.toString());

    setSearchParams(newParams);
  }, [searchTerm, selectedCategory, currentPage, setSearchParams]);

  const filteredProducts = products.filter(product => {
    const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = selectedCategory ? product.categoryId === selectedCategory : true;
    return searchMatch && categoryMatch;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
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

  // Utility for formatting a product for card display
  function formatProduct(product: Product) {
    const categoryName =
      categories.find(cat => cat.id === product.categoryId)?.name || "";
    const price =
      typeof product.price === "number"
        ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.price)
        : product.price?.toString?.() || "";
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
