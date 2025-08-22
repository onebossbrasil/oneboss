
import ProductTable from "./ProductTable";
import ProductEditDialog from "./ProductEditDialog";
import ProductListPagination from "./ProductListPagination";
import ProductFilters from "./ProductFilters";
import ProductCreateButton from "./ProductCreateButton";
import ConfirmDeleteProductModal from "./ConfirmDeleteProductModal";
import ProductListToolbar from "./ProductListToolbar";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function ProductListDesktopPanel({
  products,
  paginatedProducts,
  totalCount,
  search,
  setSearch,
  filterCategory,
  setFilterCategory,
  categoryOptions,
  filterStatus,
  setFilterStatus,
  selectedIds,
  allSelected,
  onEditClick,
  onSelectDelete,
  onToggleAll,
  onToggleProduct,
  dialogOpen,
  handleOpenCreate,
  showCreate,
  selectedProduct,
  handleDialogClose,
  confirmDelete,
  isDeleting,
  handleConfirmDelete,
  isRefreshing,
  handleManualRefresh,
  page,
  pageCount,
  handlePageChange,
  error
}: any) {
  return (
    <div className="flex flex-col items-center w-full animate-fade-in px-0 sm:px-2">
      <div className="sm:hidden fixed bottom-6 right-6 z-40">
        <ProductCreateButton onClick={handleOpenCreate} />
      </div>
      <div className="hidden sm:block w-full">
        <ProductCreateButton onClick={handleOpenCreate} />
      </div>
      <div className="w-full flex justify-center mt-2">
        <span className="text-xs text-muted-foreground">
          Total de produtos: <strong>{totalCount}</strong>
        </span>
      </div>
      <div className="w-full flex flex-col sm:flex-row justify-center gap-2 mt-4 px-2">
        <ProductFilters
          search={search}
          onSearchChange={setSearch}
          category={filterCategory}
          onCategoryChange={setFilterCategory}
          categoryOptions={categoryOptions}
          status={filterStatus}
          onStatusChange={setFilterStatus}
        />
      </div>
      <div className="w-full flex justify-center">
        <div className="border rounded-lg overflow-x-auto bg-white/80 shadow-md w-full max-w-5xl mx-auto">
          <div className="overflow-x-auto">
            <ProductTable
              products={products}
              paginatedProducts={paginatedProducts}
              selectedIds={selectedIds}
              confirmDelete={confirmDelete}
              onEditClick={onEditClick}
              onSelectDelete={onSelectDelete}
              allSelected={allSelected}
              onToggleAll={onToggleAll}
              onToggleProduct={onToggleProduct}
            />
          </div>
        </div>
      </div>
      <ProductListPagination
        page={page}
        pageCount={pageCount}
        onPageChange={handlePageChange}
      />
      <ProductListToolbar
        onRefresh={handleManualRefresh}
        onDelete={handleConfirmDelete}
        isRefreshing={isRefreshing}
        isDeleting={isDeleting}
        disableDelete={!confirmDelete && selectedIds.length === 0}
      />
      {error && (
        <Alert variant="destructive" className="mb-4 w-full max-w-5xl mx-auto">
          <AlertTitle>Problema de conexão</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="w-full sm:w-auto mt-2"
            >
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      )}
      <ProductEditDialog
        product={showCreate ? null : selectedProduct}
        open={dialogOpen}
        onOpenChange={openState => { if (!openState) handleDialogClose(); }}
        onClose={handleDialogClose}
      />
      <ConfirmDeleteProductModal
        product={confirmDelete}
        isDeleting={isDeleting}
        onCancel={() => onSelectDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
