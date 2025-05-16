
import { Button } from "@/components/ui/button";
import { Folder, Trash2, Loader2 } from "lucide-react";

type Props = {
  cat: {
    id: string; // UUID string only!
    name: string;
    value: string;
    subcategories: { length: number };
  };
  selected: boolean;
  onSelect: () => void;
  onRemove: (id: string) => void; // Only UUID
  deleting: boolean;
};

const CategoryListItem = ({ cat, selected, onSelect, onRemove, deleting }: Props) => (
  <div className="flex items-center justify-between w-full">
    <button
      className={`flex items-center flex-1 p-2 rounded-md hover:bg-accent ${
        selected ? 'bg-accent' : ''
      }`}
      onClick={onSelect}
    >
      <Folder className="h-4 w-4 mr-2" />
      <span className="text-sm">{cat.name}</span>
      <span className="ml-auto text-xs text-muted-foreground">
        {cat.subcategories.length} subcategorias
      </span>
    </button>
    <Button 
      variant="ghost" 
      size="icon"
      onClick={(e) => {
        e.stopPropagation();
        onRemove(cat.id); // UUID string
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
