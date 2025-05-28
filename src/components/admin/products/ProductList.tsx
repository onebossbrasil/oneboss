import { useProducts } from "@/contexts/ProductContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useProductFilters } from "./hooks/useProductFilters";
import { useProductListLogic } from "./hooks/useProductListLogic";
import ProductListMobilePanel from "./ProductListMobilePanel";
import ProductListDesktopPanel from "./ProductListDesktopPanel";
import ProductImagesAuditReport from "./ProductImagesAuditReport";

export default function ProductList() {
  const { products, isLoading, error } = useProducts();
  const isMobile = useIsMobile();

  const {
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
  } = useProductFilters(products);

  const {
    selectedProduct,
    dialogOpen,
    showCreate,
    confirmDelete,
    selectedIds,
    isRefreshing,
    handleOpenCreate,
    handleEditClick,
    handleDialogClose,
    handleToggleAll,
    handleToggleProduct,
    handleManualRefresh,
    setConfirmDelete
  } = useProductListLogic(products);

  // Seleção de IDs para a página
  const paginatedIds = paginatedProducts.map(p => p.id);
  const allSelected = paginatedIds.length > 0 && paginatedIds.every(id => selectedIds.includes(id));

  const handlePageChange = (p: number) => {
    if (p >= 1 && p <= pageCount) setPage(p);
  };

  // Funções de exclusão
  const handleSelectDelete = (product) => {
    setConfirmDelete(product);
  };
  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    await useProducts().deleteProduct(confirmDelete.id);
    setConfirmDelete(null);
  };

  return (
    <div>
      {/* Painel de auditoria removido */}
      {isMobile ? (
        <ProductListMobilePanel
          products={filteredProducts}
          paginatedProducts={paginatedProducts}
          search={search}
          setSearch={setSearch}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          categoryOptions={categories || []}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
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
          isDeleting={isLoading}
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
          search={search}
          setSearch={setSearch}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          categoryOptions={categories || []}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
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
          isDeleting={isLoading}
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
