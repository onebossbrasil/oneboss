
import { useIsMobile } from "@/hooks/useIsMobile";
import { useProductListLogic } from "./hooks/useProductListLogic";
import ProductListMobilePanel from "./ProductListMobilePanel";
import ProductListDesktopPanel from "./ProductListDesktopPanel";
import ProductImagesAuditReport from "./ProductImagesAuditReport";
import { AdminProductProvider, useAdminProducts } from "@/contexts/product/AdminProductProvider";
import { useCategories } from "@/contexts/CategoryContext";
import { useState, useEffect } from "react";

// Componente interno que usa o AdminProductProvider
function ProductListContent() {
  const { 
    products, 
    isLoading, 
    error, 
    page, 
    setPage, 
    totalCount,
    filters,
    setFilters
  } = useAdminProducts();
  
  const { categories } = useCategories();
  const isMobile = useIsMobile();

  // Estado local para busca com debounce
  const [localSearch, setLocalSearch] = useState("");

  // Debounce para busca (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("[ProductListContent] Aplicando busca com debounce:", localSearch);
      setFilters({ search: localSearch });
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, setFilters]);

  // Como os produtos já vêm filtrados e paginados do servidor:
  const filteredProducts = products;
  const paginatedProducts = products;
  const PAGE_SIZE = 20;
  const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // Handlers para filtros que atualizam diretamente no contexto
  const handleSearchChange = (value: string) => {
    console.log("[ProductListContent] handleSearchChange chamado com:", value);
    setLocalSearch(value);
  };

  const handleCategoryChange = (value: string) => {
    setFilters({ categoryId: value });
  };

  const handleStatusChange = (value: string) => {
    setFilters({ status: value });
  };

  // Estados atuais dos filtros do contexto
  const search = localSearch; // Usar estado local para o campo de busca
  const filterCategory = filters.categoryId;
  const filterStatus = filters.status;

  const {
    selectedProduct,
    dialogOpen,
    showCreate,
    confirmDelete,
    selectedIds,
    isRefreshing,
    isDeleting,
    handleOpenCreate,
    handleEditClick,
    handleDialogClose,
    handleToggleAll,
    handleToggleProduct,
    handleManualRefresh,
    handleSelectDelete,
    handleConfirmDelete,
    setConfirmDelete
  } = useProductListLogic(products);

  // Seleção de IDs para a página
  const paginatedIds = paginatedProducts.map(p => p.id);
  const allSelected = paginatedIds.length > 0 && paginatedIds.every(id => selectedIds.includes(id));

  const handlePageChange = (p: number) => {
    if (p < 1 || p > pageCount) return;
    setPage(p);
  };

  return (
    <div>
      {/* Painel de auditoria removido */}
      {isMobile ? (
        <ProductListMobilePanel
          products={filteredProducts}
          paginatedProducts={paginatedProducts}
          totalCount={totalCount}
          search={search}
          setSearch={handleSearchChange}
          filterCategory={filterCategory}
          setFilterCategory={handleCategoryChange}
          categoryOptions={categories || []}
          filterStatus={filterStatus}
          setFilterStatus={handleStatusChange}
          selectedIds={selectedIds}
          onEditClick={handleEditClick}
          onSelectDelete={handleSelectDelete}
          onToggleProduct={handleToggleProduct}
          dialogOpen={dialogOpen}
          handleOpenCreate={handleOpenCreate}
          showCreate={showCreate}
          selectedProduct={selectedProduct}
          handleDialogClose={handleDialogClose}
          confirmDelete={confirmDelete}
          isDeleting={isDeleting}
          handleConfirmDelete={handleConfirmDelete}
          isRefreshing={isRefreshing}
          handleManualRefresh={handleManualRefresh}
          page={page}
          pageCount={pageCount}
          handlePageChange={handlePageChange}
          error={error}
        />
      ) : (
        <ProductListDesktopPanel
          products={filteredProducts}
          paginatedProducts={paginatedProducts}
          totalCount={totalCount}
          search={search}
          setSearch={handleSearchChange}
          filterCategory={filterCategory}
          setFilterCategory={handleCategoryChange}
          categoryOptions={categories || []}
          filterStatus={filterStatus}
          setFilterStatus={handleStatusChange}
          selectedIds={selectedIds}
          allSelected={allSelected}
          onEditClick={handleEditClick}
          onSelectDelete={handleSelectDelete}
          onToggleAll={checked => handleToggleAll(paginatedIds, checked)}
          onToggleProduct={handleToggleProduct}
          dialogOpen={dialogOpen}
          handleOpenCreate={handleOpenCreate}
          showCreate={showCreate}
          selectedProduct={selectedProduct}
          handleDialogClose={handleDialogClose}
          confirmDelete={confirmDelete}
          isDeleting={isDeleting}
          handleConfirmDelete={handleConfirmDelete}
          isRefreshing={isRefreshing}
          handleManualRefresh={handleManualRefresh}
          page={page}
          pageCount={pageCount}
          handlePageChange={handlePageChange}
          error={error}
        />
      )}
    </div>
  );
}

// Componente principal que envolve com AdminProductProvider
export default function ProductList() {
  return (
    <AdminProductProvider>
      <ProductListContent />
    </AdminProductProvider>
  );
}
