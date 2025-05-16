import { useState, useEffect, useCallback } from "react";
import { useProducts } from "@/contexts/ProductContext";
import ProductEditDialog from "./ProductEditDialog";
import { Product } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trash2, Plus } from "lucide-react";
import { useDeleteProduct } from "@/hooks/product/use-delete-product";
import PaginationArrows from "@/components/ui/PaginationArrows";
import ProductTable from "./ProductTable";
import ProductFilters from "./ProductFilters";
import ProductCreateButton from "./ProductCreateButton";
import ConfirmDeleteProductModal from "./ConfirmDeleteProductModal";
import { useCategories } from "@/contexts/CategoryContext";

const PAGE_SIZE = 20;

export default function ProductList() {
  const { products, refreshProducts, isLoading, error } = useProducts();
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);
  const { isLoading: isDeleting, deleteProduct } = useDeleteProduct();
  const [showCreate, setShowCreate] = useState(false);

  // Filtros
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  // FIX: Directly destructure categories from context
  const { categories } = useCategories();

  // Filtragem local dos produtos
  const filteredProducts = products.filter((product) => {
    const matchesName = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      !filterCategory ||
      product.categoryId === filterCategory;
    const matchesStatus =
      !filterStatus ||
      (filterStatus === "published" && product.published) ||
      (filterStatus === "unpublished" && !product.published);
    return matchesName && matchesCategory && matchesStatus;
  });

  // Seleção em massa
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const allSelected = filteredProducts.length > 0 && selectedIds.length === filteredProducts.length;

  // Paginação
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const paginatedProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const [lastRefreshTime, setLastRefreshTime] = useState(0);
  const MIN_REFRESH_INTERVAL = 1500; // ms

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  useEffect(() => {
    setSelectedIds([]);
    setPage(1);
  }, [products]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Erro ao carregar produtos",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setSelectedProduct(null);
    setDialogOpen(false);
    setShowCreate(false);
  };

  const handleManualRefresh = useCallback(async () => {
    const now = Date.now();
    if (now - lastRefreshTime < MIN_REFRESH_INTERVAL) {
      toast({
        title: "Aguarde um momento",
        description: "Por favor aguarde antes de atualizar novamente",
      });
      return;
    }

    setIsRefreshing(true);
    setLastRefreshTime(now);

    try {
      await refreshProducts(true);
      toast({
        title: "Lista atualizada",
        description: "Os dados foram sincronizados com o banco de dados",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar lista",
        description: "Não foi possível sincronizar com o banco de dados",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshProducts, lastRefreshTime, toast]);

  const handleConfirmDelete = async () => {
    let idsToDelete: string[] = [];

    if (selectedIds.length > 0) {
      idsToDelete = selectedIds;
    } else if (confirmDelete) {
      idsToDelete = [confirmDelete.id];
    }
    if (idsToDelete.length === 0) return;

    try {
      for (const id of idsToDelete) {
        await deleteProduct(id);
      }
      setConfirmDelete(null);
      setSelectedIds([]);
      refreshProducts(true);
    } catch (error) {
      // mensagem já tratada no hook
    }
  };

  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredProducts.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleProduct = (id: string, checked: boolean) => {
    setSelectedIds(prev =>
      checked ? [...prev, id] : prev.filter(pid => pid !== id)
    );
  };

  const handlePageChange = (p: number) => {
    if (p >= 1 && p <= pageCount) setPage(p);
  };

  return (
    <div className="flex flex-col items-center w-full animate-fade-in">
      {/* Botão flutuante/destaque para cadastrar produto */}
      <ProductCreateButton onClick={() => setShowCreate(true)} />

      {/* Barra de filtros */}
      <div className="w-full flex justify-center mt-4">
        <ProductFilters
          search={search}
          onSearchChange={setSearch}
          category={filterCategory}
          onCategoryChange={setFilterCategory}
          categoryOptions={categories || []}
          status={filterStatus}
          onStatusChange={setFilterStatus}
        />
      </div>

      {/* Lista de Produtos */}
      <div className="w-full flex justify-center">
        <div className="border rounded-lg overflow-x-auto bg-white/80 shadow-md w-full max-w-5xl mx-auto">
          <div className="overflow-x-auto">
            <ProductTable
              products={filteredProducts}
              paginatedProducts={paginatedProducts}
              selectedIds={selectedIds}
              confirmDelete={confirmDelete}
              onEditClick={handleEditClick}
              onSelectDelete={setConfirmDelete}
              allSelected={allSelected}
              onToggleAll={handleToggleAll}
              onToggleProduct={handleToggleProduct}
            />
          </div>
        </div>
      </div>

      <PaginationArrows
        page={page}
        pageCount={pageCount}
        onPageChange={handlePageChange}
        className="my-8"
      />

      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-6 mb-4 w-full max-w-5xl mx-auto">
        <h3 className="text-lg font-medium">Produtos Cadastrados</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isLoading || isRefreshing}
            className="flex items-center gap-1"
          >
            <RefreshCw className={isRefreshing ? "animate-spin h-4 w-4" : "h-4 w-4"} />
            <span className="hidden sm:inline">Atualizar</span>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-1"
            disabled={(!confirmDelete && selectedIds.length === 0) || isDeleting}
            onClick={handleConfirmDelete}
            style={{ minWidth: 100 }}
          >
            <Trash2 className="h-4 w-4" />
            Excluir Produto
          </Button>
        </div>
      </div>

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

      {isLoading ? (
        <div className="flex justify-center py-8 w-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : null}

      <ProductEditDialog
        product={selectedProduct}
        open={dialogOpen || showCreate}
        onOpenChange={openState => {
          if (!openState) {
            handleDialogClose();
          } else {
            setDialogOpen(!!selectedProduct);
            setShowCreate(!selectedProduct);
          }
        }}
        onClose={handleDialogClose}
      />

      <ConfirmDeleteProductModal
        product={confirmDelete}
        isDeleting={isDeleting}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
