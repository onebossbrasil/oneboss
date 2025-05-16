
import { Button } from "@/components/ui/button";

type BulkActionBarProps = {
  selectedCount: number;
  onUnselectAll: () => void;
  onDeleteSelected: () => void;
  onPublishSelected: () => void;
  onUnpublishSelected: () => void;
};

const BulkActionBar = ({
  selectedCount,
  onUnselectAll,
  onDeleteSelected,
  onPublishSelected,
  onUnpublishSelected,
}: BulkActionBarProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg shadow-sm px-4 py-3 mb-3 flex flex-col md:flex-row md:items-center justify-between gap-2 animate-fade-in w-full max-w-5xl mx-auto sticky top-2 z-20">
      <span className="font-medium text-sm">
        {selectedCount} produto{selectedCount > 1 ? "s" : ""} selecionado{selectedCount > 1 ? "s" : ""} nesta página
      </span>
      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" size="sm" onClick={onUnselectAll}>
          Desmarcar todos nesta página
        </Button>
        <Button variant="destructive" size="sm" onClick={onDeleteSelected}>
          Excluir selecionados
        </Button>
        <Button variant="default" size="sm" onClick={onPublishSelected}>
          Publicar selecionados
        </Button>
        <Button variant="secondary" size="sm" onClick={onUnpublishSelected}>
          Ocultar selecionados
        </Button>
      </div>
    </div>
  );
};

export default BulkActionBar;
