
import { Button } from "@/components/ui/button";
import { Folder, Trash2, Loader2 } from "lucide-react";

type Props = {
  cat: {
    id: string;
    name: string;
    value: string;
    subcategories: { length: number };
  };
  selected: boolean;
  onSelect: () => void;
  onRemove: (id: string) => void;
  deleting: boolean;
};

// Layout novo: linhas de categoria expandem para mostrar nome e atributos completos
const CategoryListItem = ({ cat, selected, onSelect, onRemove, deleting }: Props) => (
  <div className={`flex items-center justify-between w-full rounded-lg shadow-sm border ${selected ? "border-accent bg-accent/30" : "bg-white"} px-3 py-2 transition-all hover:shadow-md`}>
    <button
      className="flex items-center flex-1 gap-3 min-w-0 focus:outline-none"
      onClick={onSelect}
      style={{ minWidth: 0 }}
    >
      <Folder className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0" />
      <span className="text-base font-medium whitespace-normal break-words max-w-[170px]">{cat.name}</span>
      <span className="ml-auto text-sm text-muted-foreground whitespace-nowrap min-w-[116px] text-right">
        {cat.subcategories.length} subcategoria{cat.subcategories.length !== 1 ? "s" : ""}
      </span>
    </button>
    <Button 
      variant="ghost" 
      size="icon"
      onClick={(e) => {
        e.stopPropagation();
        onRemove(cat.id);
      }}
      disabled={deleting}
      className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-2"
      aria-label="Excluir categoria"
    >
      {deleting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  </div>
);

export default CategoryListItem;
