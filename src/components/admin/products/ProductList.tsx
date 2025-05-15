import { useState, useEffect, useCallback } from "react";
import { useProducts } from "@/contexts/ProductContext";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProductTableRow from "./ProductTableRow";
import ProductEditDialog from "./ProductEditDialog";
import { Product } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trash2 } from "lucide-react";
import { useDeleteProduct } from "@/hooks/product/use-delete-product";
import { Checkbox } from "@/components/ui/checkbox";
import { useProductSelection } from "@/hooks/product/useProductSelection";

export default function ProductList() {
  const { products, refreshProducts, isLoading, error } = useProducts();
  const { 
    selectedIds, 
    toggleSelect, 
    toggleSelectAll, 
    isSelected, 
    isAllSelected, 
    clearSelection 
  } = useProductSelection(products.map((p) => p.id));
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);
  const { isLoading: isDeleting, deleteProduct } = useDeleteProduct();

  // Add debounce protection for manual refreshes
  const [lastRefreshTime, setLastRefreshTime] = useState(0);
  const MIN_REFRESH_INTERVAL = 1500; // ms

  useEffect(() => {
    // Load products at mount
    refreshProducts();
  }, [refreshProducts]);

  useEffect(() => {
    // Show toast of error if there's a problem loading products
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
    if (selectedIds.length === 0 && !confirmDelete) return;
    try {
      if (confirmDelete) {
        await deleteProduct(confirmDelete.id);
      } else {
        // Multi-delete
        for (let id of selectedIds) {
          await deleteProduct(id);
        }
        clearSelection();
      }
      setConfirmDelete(null);
      refreshProducts(true);
    } catch (error) {
      // mensagem já tratada no hook
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
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
            disabled={(selectedIds.length === 0 && !confirmDelete) || isDeleting}
            onClick={handleConfirmDelete}
            style={{ minWidth:100 }}
          >
            <Trash2 className="h-4 w-4" />
            {selectedIds.length > 1 ? `Excluir Selecionados` : `Excluir Produto`}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
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
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden bg-gray-50">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Selecionar todos"
                    />
                  </TableHead>
                  <TableHead>Imagem</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead className="text-center">Publicado</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <ProductEmptyState />
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <ProductTableRow
                      key={product.id}
                      product={product}
                      onEditClick={handleEditClick}
                      onSelectDelete={setConfirmDelete}
                      isSelectedToDelete={confirmDelete?.id === product.id}
                      isChecked={isSelected(product.id)}
                      onCheckToggle={() => toggleSelect(product.id)}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <ProductEditDialog
        product={selectedProduct}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onClose={handleDialogClose}
      />

      {/* Modal de confirmação de exclusão (pode estender com dialog/modal, simplificado aqui) */}
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

const ProductEmptyState = () => (
  <td colSpan={6} className="text-center py-4 text-muted-foreground">
    Nenhum produto cadastrado
  </td>
);
