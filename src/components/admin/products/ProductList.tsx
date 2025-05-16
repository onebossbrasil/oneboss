
import { useState, useEffect, useCallback } from "react";
import { useProducts } from "@/contexts/ProductContext";
import ProductEditDialog from "./ProductEditDialog";
import { Product } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trash2 } from "lucide-react";
import { useDeleteProduct } from "@/hooks/product/use-delete-product";
import PaginationArrows from "@/components/ui/PaginationArrows";
import ProductTable from "./ProductTable";

const PAGE_SIZE = 10;

export default function ProductList() {
  const { products, refreshProducts, isLoading, error } = useProducts();
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);
  const { isLoading: isDeleting, deleteProduct } = useDeleteProduct();
  const [showCreate, setShowCreate] = useState(false);

  // Seleção em massa
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const allSelected = products.length > 0 && selectedIds.length === products.length;

  // Paginação
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(products.length / PAGE_SIZE);
  const paginatedProducts = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
      setSelectedIds(products.map(p => p.id));
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
      <div className="w-full flex justify-center mb-8">
        <div className="bg-[#FAFAFA] border border-gold px-6 sm:px-8 py-6 rounded-lg shadow-lg w-full max-w-5xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mx-auto">
          <div>
            <h2 className="text-xl font-bold mb-2 text-gold" style={{ color: "#C9A227" }}>
              Cadastre um novo produto!
            </h2>
            <p className="text-muted-foreground mb-2">
              Clique no botão ao lado para adicionar rapidamente um novo item à loja.
            </p>
          </div>
          <Button
            variant="default"
            className="flex items-center font-bold px-6 py-3 text-base shadow border border-gold bg-gold hover:bg-gold/80 text-white"
            onClick={() => setShowCreate(true)}
            style={{
              backgroundColor: "#C9A227",
              borderColor: "#C9A227",
              color: "#fff"
            }}
          >
            <span className="mr-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5"
                  y1="12" x2="19" y2="12"></line></svg>
            </span>
            Cadastrar Produto
          </Button>
        </div>
      </div>

      {/* Lista de Produtos */}
      <div className="w-full flex justify-center">
        <div className="border rounded-lg overflow-x-auto bg-white/80 shadow-md w-full max-w-5xl mx-auto">
          <div className="overflow-x-auto">
            <ProductTable
              products={products}
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

      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-30">
          <div className="bg-white rounded shadow-lg p-6 dark:bg-gray-900 flex flex-col gap-4 max-w-md w-full">
            <h4 className="font-bold text-lg">Confirmar Exclusão</h4>
            <p>Deseja excluir o produto <b>{confirmDelete.name}</b>?</p>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setConfirmDelete(null)} disabled={isDeleting}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Excluindo..." : "Excluir"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
