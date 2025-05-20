
import { Button } from "@/components/ui/button";
import { RefreshCw, Trash2 } from "lucide-react";

interface ProductListToolbarProps {
  onRefresh: () => void;
  onDelete: () => void;
  isRefreshing: boolean;
  isDeleting: boolean;
  disableDelete: boolean;
}

export default function ProductListToolbar({
  onRefresh,
  onDelete,
  isRefreshing,
  isDeleting,
  disableDelete,
}: ProductListToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-6 mb-4 w-full max-w-5xl mx-auto">
      <h3 className="text-lg font-medium">Produtos Cadastrados</h3>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1"
        >
          <RefreshCw className={isRefreshing ? "animate-spin h-4 w-4" : "h-4 w-4"} />
          <span className="hidden sm:inline">Atualizar</span>
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="flex items-center gap-1"
          disabled={disableDelete || isDeleting}
          onClick={onDelete}
          style={{ minWidth: 100 }}
        >
          <Trash2 className="h-4 w-4" />
          Excluir Produto
        </Button>
      </div>
    </div>
  );
}
