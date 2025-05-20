
import { useState, useEffect, useMemo } from "react";
import { useCategories } from "@/contexts/CategoryContext";
import { Product } from "@/types/product";

export function useProductFilters(products: Product[]) {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const { categories } = useCategories();

  // Filtro local + ordenação alfabética
  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesName = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !filterCategory || product.categoryId === filterCategory;
    const matchesStatus =
      !filterStatus ||
      (filterStatus === "published" && product.published) ||
      (filterStatus === "unpublished" && !product.published);
    return matchesName && matchesCategory && matchesStatus;
  }).sort((a, b) => a.name.localeCompare(b.name)), [products, search, filterCategory, filterStatus]);

  // Paginação
  const PAGE_SIZE = 20;
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const paginatedProducts = useMemo(() =>
    filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredProducts, page, PAGE_SIZE]
  );

  useEffect(() => {
    setPage(1);
  }, [search, filterCategory, filterStatus, products]);

  return {
    search,
    setSearch,
    filterCategory,
    setFilterCategory,
    filterStatus,
    setFilterStatus,
    categories,
    filteredProducts,
    paginatedProducts,
    page,
    setPage,
    pageCount
  }
}
