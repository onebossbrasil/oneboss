
import { useState, useCallback } from "react";
import { useAdminProducts } from "@/contexts/product/AdminProductProvider";
import { Product } from "@/types/product";
import { useToast } from "@/hooks/use-toast";

export function useProductListLogic(products: Product[]) {
  const { toast } = useToast();
  const { refreshProducts, updateProduct, deleteProduct } = useAdminProducts();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Seleção em massa (só ids visiveis)
  const handleToggleAll = (paginatedIds: string[], checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, ...paginatedIds.filter(id => !prev.includes(id))]);
    } else {
      setSelectedIds(prev => prev.filter(id => !paginatedIds.includes(id)));
    }
  };
  const handleToggleProduct = (id: string, checked: boolean) => {
    setSelectedIds(prev =>
      checked ? [...prev, id] : prev.filter(pid => pid !== id)
    );
  };

  // Handlers de CRUD/modal
  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setDialogOpen(true);
    setShowCreate(true);
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
    setShowCreate(false);
  };
  const handleDialogClose = () => {
    setSelectedProduct(null);
    setDialogOpen(false);
    setShowCreate(false);
  };

  const MIN_REFRESH_INTERVAL = 1500;
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
    } catch {
      toast({
        title: "Erro ao atualizar lista",
        description: "Não foi possível sincronizar com o banco de dados",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshProducts, lastRefreshTime, toast]);

  // Exclusão segura
  const handleSelectDelete = (product: Product|null) => {
    setConfirmDelete(product);
  };

  const handleConfirmDelete = useCallback(async () => {
    if (!confirmDelete) return;
    setIsDeleting(true);
    try {
      await deleteProduct(confirmDelete.id);
      setConfirmDelete(null);
      toast({
        title: "Produto excluído",
        description: "O produto foi removido com sucesso.",
      });
    } catch (err) {
      // O erro já é tratado em deleteProduct e toast mostrado lá.
    } finally {
      setIsDeleting(false);
    }
  }, [confirmDelete, deleteProduct, toast]);

  return {
    selectedProduct, setSelectedProduct,
    dialogOpen, setDialogOpen,
    showCreate, setShowCreate,
    confirmDelete, setConfirmDelete,
    selectedIds, setSelectedIds,
    isRefreshing,
    isDeleting,
    handleOpenCreate,
    handleEditClick,
    handleDialogClose,
    handleToggleAll,
    handleToggleProduct,
    handleManualRefresh,
    handleSelectDelete,
    handleConfirmDelete
  }
}
