
import { useState, useEffect, useCallback } from "react";
import { useProducts } from "@/contexts/ProductContext";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import ProductTableRow from "./ProductTableRow";
import ProductEditDialog from "./ProductEditDialog";
import { Product } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trash2, Plus } from "lucide-react";
import { useDeleteProduct } from "@/hooks/product/use-delete-product";
import ProductTableHeader from "./ProductTableHeader";
import { Checkbox } from "@/components/ui/checkbox";

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

  // Debounce proteção para atualizar manualmente
  const [lastRefreshTime, setLastRefreshTime] = useState(0);
  const MIN_REFRESH_INTERVAL = 1500; // ms

  useEffect(() => {
    // Load products ao montar
    refreshProducts();
  }, [refreshProducts]);

  useEffect(() => {
    // Resetar seleção quando recarrega produtos
    setSelectedIds([]);
  }, [products]);

  useEffect(() => {
    // Toast erro (problema ao carregar)
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
    let idsToDelete: string[] = [];

    // Se houver seleção em massa, deletar todos os produtos selecionados.
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

  // Marcar/desmarcar todos os produtos
  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(products.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  // Marcar/desmarcar produto individual
  const handleToggleProduct = (id: string, checked: boolean) => {
    setSelectedIds(prev =>
      checked ? [...prev, id] : prev.filter(pid => pid !== id)
    );
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Destaque para área de cadastrar produto */}
      <div className="w-full flex justify-center mb-8">
        <div className="bg-gold/10 border border-gold px-8 py-6 rounded-lg shadow-md w-[70%] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 animate-fade-in">
          <div>
            <h2 className="text-xl font-bold mb-2 text-gold">Cadastre um novo produto!</h2>
            <p className="text-muted-foreground mb-2">
              Clique no botão ao lado para adicionar rapidamente um novo item à loja.
            </p>
          </div>
          <Button
            variant="default"
            className="btn-hover-effect flex items-center gap-2 font-bold px-6 py-4 text-lg"
            onClick={() => setShowCreate(true)}
          >
            <Plus className="h-5 w-5" />
            Cadastrar Produto
          </Button>
        </div>
      </div>

      <div className="w-full flex justify-center">
        <div className="border rounded-md overflow-hidden bg-white dark:bg-gray-900 shadow-sm w-full max-w-5xl" style={{ width: "70%" }}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <ProductTableHeader
                  allSelected={allSelected}
                  onToggleAll={checked => handleToggleAll(!!checked)}
                />
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
                      selectionCheckbox={
                        <Checkbox
                          checked={selectedIds.includes(product.id)}
                          onCheckedChange={checked => handleToggleProduct(product.id, !!checked)}
                        />
                      }
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-6 mb-4 w-full max-w-5xl" style={{ width: "70%" }}>
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
        <Alert variant="destructive" className="mb-4 w-full max-w-5xl" style={{ width: "70%" }}>
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
        onOpenChange={setDialogOpen}
        onClose={() => {
          setShowCreate(false);
          handleDialogClose();
        }}
      />

      {/* Modal de confirmação de exclusão */}
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

// Adicionando prop selectionCheckbox em ProductTableRow
const ProductEmptyState = () => (
  <td colSpan={7} className="text-center py-4 text-muted-foreground">
    Nenhum produto cadastrado
  </td>
);
