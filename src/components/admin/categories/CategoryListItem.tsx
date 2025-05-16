
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

const CategoryListItem = ({ cat, selected, onSelect, onRemove, deleting }: Props) => (
  <div className="flex items-center justify-between w-full px-1">
    <button
      className={`flex items-center flex-1 p-2 rounded-md gap-3 hover:bg-accent transition-colors ${
        selected ? 'bg-accent' : ''
      }`}
      onClick={onSelect}
      style={{ minWidth: 0 }}
    >
      <Folder className="h-4 w-4 mr-2 shrink-0" />
      <span className="text-sm truncate">{cat.name}</span>
      <span className="ml-auto text-xs text-muted-foreground min-w-[90px] text-right">
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
      className="text-red-500 hover:text-red-700 hover:bg-red-50"
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
