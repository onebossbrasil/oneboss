import { useState, useEffect, useCallback } from "react";
import { useProducts } from "@/contexts/ProductContext";
import ProductEditDialog from "./ProductEditDialog";
import { Product } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import ProductListToolbar from "./ProductListToolbar";
import ProductListPagination from "./ProductListPagination";
import ProductTable from "./ProductTable";
import ProductFilters from "./ProductFilters";
import ProductCreateButton from "./ProductCreateButton";
import ConfirmDeleteProductModal from "./ConfirmDeleteProductModal";
import { useCategories } from "@/contexts/CategoryContext";
import BulkActionBar from "./BulkActionBar";

const PAGE_SIZE = 20;

export default function ProductList() {
  const { products, refreshProducts, isLoading, error, updateProduct } = useProducts();
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);
  const { isLoading: isDeleting, deleteProduct } = useProducts();
  const [showCreate, setShowCreate] = useState(false);

  // Diagnóstico: logar toda vez que lista é recarregada
  useEffect(() => {
    console.info("[ProductList] Recarregando lista. Quantidade de produtos:", products.length);
  }, [products]);

  // Filtros
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const { categories } = useCategories();

  // Filtragem local e ordenação
  const filteredProducts = products
    .filter((product) => {
      const matchesName = product.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !filterCategory || product.categoryId === filterCategory;
      const matchesStatus =
        !filterStatus ||
        (filterStatus === "published" && product.published) ||
        (filterStatus === "unpublished" && !product.published);
      return matchesName && matchesCategory && matchesStatus;
    })
    .sort((a, b) => a.name.localeCompare(b.name)); // <-- Ordenação alfabética

  // Paginação
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const paginatedProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Seleção em massa para produtos da página atual
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const paginatedIds = paginatedProducts.map(p => p.id);
  const allSelected = paginatedIds.length > 0 && paginatedIds.every(id => selectedIds.includes(id));

  const [lastRefreshTime, setLastRefreshTime] = useState(0);
  const MIN_REFRESH_INTERVAL = 1500; // ms

  useEffect(() => {
    refreshProducts();
    console.info("[ProductList] refreshProducts acionado.");
  }, [refreshProducts]);

  useEffect(() => {
    setSelectedIds([]);
    setPage(1);
  }, [products]);

  useEffect(() => {
    if (error) {
      console.error("[ProductList] Erro detectado:", error);
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

  // Selecionar/Desselecionar apenas os produtos da página
  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [
        ...prev,
        ...paginatedIds.filter(id => !prev.includes(id)),
      ]);
    } else {
      setSelectedIds(prev => prev.filter(id => !paginatedIds.includes(id)));
    }
  };

  const handleToggleProduct = (id: string, checked: boolean) => {
    setSelectedIds(prev =>
      checked ? [...prev, id] : prev.filter(pid => pid !== id)
    );
  };

  const handleUnselectPage = () => {
    setSelectedIds(prev => prev.filter(id => !paginatedIds.includes(id)));
  };

  // Exclui selecionados da página atual
  const handleBulkDelete = async () => {
    if (paginatedIds.length === 0) return;

    try {
      for (const id of paginatedIds) {
        if (selectedIds.includes(id)) {
          await deleteProduct(id);
        }
      }
      setSelectedIds(prev => prev.filter(id => !paginatedIds.includes(id)));
      refreshProducts(true);
    } catch (error) {
      // mensagem já tratada no hook
    }
  };

  // Publica todos selecionados na página
  const handleBulkPublish = async () => {
    for (const id of paginatedIds) {
      if (selectedIds.includes(id)) {
        const product = products.find(p => p.id === id);
        if (product && !product.published) {
          await updateProduct(product.id, { published: true });
        }
      }
    }
    refreshProducts(true);
    setSelectedIds(prev => prev.filter(id => !paginatedIds.includes(id)));
  };
  // Oculta todos selecionados na página
  const handleBulkUnpublish = async () => {
    for (const id of paginatedIds) {
      if (selectedIds.includes(id)) {
        const product = products.find(p => p.id === id);
        if (product && product.published) {
          await updateProduct(product.id, { published: false });
        }
      }
    }
    refreshProducts(true);
    setSelectedIds(prev => prev.filter(id => !paginatedIds.includes(id)));
  };

  const handlePageChange = (p: number) => {
    if (p >= 1 && p <= pageCount) setPage(p);
  };

  return (
    <div className="flex flex-col items-center w-full animate-fade-in">
      <BulkActionBar
        selectedCount={paginatedIds.filter(id => selectedIds.includes(id)).length}
        onUnselectAll={handleUnselectPage}
        onDeleteSelected={handleBulkDelete}
        onPublishSelected={handleBulkPublish}
        onUnpublishSelected={handleBulkUnpublish}
      />
      {/* Botão para cadastrar/ou criar produto */}
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
        disableDelete={(!confirmDelete && selectedIds.length === 0)}
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
