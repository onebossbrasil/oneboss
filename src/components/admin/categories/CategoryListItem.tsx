
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

// Refatorado: layout flexível, nome e quantidade SEM limite de largura visível
const CategoryListItem = ({ cat, selected, onSelect, onRemove, deleting }: Props) => (
  <div
    className={`
      flex flex-row items-center justify-between w-full
      rounded-xl shadow-sm border
      transition-all hover:shadow-md
      ${selected ? "border-primary bg-primary/10" : "bg-white"}
      px-5 py-3
      cursor-pointer
    `}
    style={{
      minHeight: 64,
      minWidth: 0,
    }}
    onClick={onSelect}
    tabIndex={0}
    aria-selected={selected}
  >
    <div className="flex flex-row items-center gap-4 flex-1 min-w-0">
      <Folder className="h-6 w-6 text-primary flex-shrink-0" />
      <span className="text-base font-semibold text-foreground break-words whitespace-pre-line flex-1 min-w-0">
        {cat.name}
      </span>
    </div>
    <span className="ml-6 text-sm text-muted-foreground flex-shrink-0">
      {cat.subcategories.length} {cat.subcategories.length === 1 ? "subcategoria" : "subcategorias"}
    </span>
    <Button 
      variant="ghost" 
      size="icon"
      onClick={e => {
        e.stopPropagation();
        onRemove(cat.id);
      }}
      disabled={deleting}
      className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-4"
      aria-label="Excluir categoria"
    >
      {deleting ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Trash2 className="h-5 w-5" />
      )}
    </Button>
  </div>
);

export default CategoryListItem;
