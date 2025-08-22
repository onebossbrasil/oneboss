import { useState, useEffect } from "react";
import { useCategories } from "@/contexts/CategoryContext";
import { useAdminProducts } from "@/contexts/product/AdminProductProvider";

export function useProductFiltersServerSide() {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const { categories } = useCategories();
  const { 
    products, 
    isLoading, 
    error, 
    page, 
    setPage, 
    totalCount,
    refreshProducts 
  } = useAdminProducts();

  // Função para aplicar filtros (será implementada no ProductProvider)
  const applyFilters = async () => {
    // Os filtros são aplicados automaticamente pelo ProductProvider
    // quando os estados de filtro mudam
    await refreshProducts(true);
  };

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, filterCategory, filterStatus, setPage]);

  // Para compatibilidade com o sistema atual, retornamos os products diretamente
  // já que agora eles vêm filtrados do servidor
  const filteredProducts = products;
  const paginatedProducts = products; // Já vem paginado do servidor
  
  // O pageCount agora é calculado baseado no totalCount do servidor
  const PAGE_SIZE = 20;
  const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

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
    pageCount,
    totalCount,
    isLoading,
    error,
    applyFilters
  };
}