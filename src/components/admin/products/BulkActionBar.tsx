
import { Button } from "@/components/ui/button";
import { Trash2, X, Check } from "lucide-react";

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
    <div className="w-full max-w-5xl mx-auto rounded-xl bg-white border border-gray-200 shadow-md px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 sticky top-2 z-30 transition-all animate-fade-in">
      <span className="text-base font-normal text-gray-900">
        {selectedCount} produto{selectedCount > 1 ? "s" : ""} selecionado{selectedCount > 1 ? "s" : ""} nesta página
      </span>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-gray-600 border-gray-300 hover:bg-gray-100"
          onClick={onUnselectAll}
        >
          <X className="w-4 h-4 mr-1" />
          Desmarcar todos nesta página
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="bg-red-500 hover:bg-red-600 text-white font-medium"
          onClick={onDeleteSelected}
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Excluir selecionados
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="bg-zinc-900 hover:bg-zinc-800 text-white font-medium"
          onClick={onUnpublishSelected}
        >
          Ocultar selecionados
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-yellow-400 hover:bg-yellow-500 text-white font-medium border-yellow-400 hover:border-yellow-500"
          onClick={onPublishSelected}
        >
          <Check className="w-4 h-4 mr-1" />
          Publicar selecionados
        </Button>
      </div>
    </div>
  );
};

export default BulkActionBar;

