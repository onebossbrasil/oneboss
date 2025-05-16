
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

// Card: ocupa horizontalmente, nome NÃO quebra no meio, ícone > nome > quantidade, layout limpo
const CategoryListItem = ({ cat, selected, onSelect, onRemove, deleting }: Props) => (
  <div
    className={`
      flex items-center w-full
      rounded-xl shadow-sm border bg-white
      transition-all hover:shadow-md
      ${selected ? "border-primary bg-primary/10" : ""}
      px-6 py-4
      cursor-pointer
      min-h-[60px]
      group
    `}
    style={{
      minWidth: 0,
    }}
    onClick={onSelect}
    tabIndex={0}
    aria-selected={selected}
  >
    <Folder className="h-6 w-6 text-primary mr-5 flex-shrink-0" />
    <span
      className="
        text-base font-semibold text-foreground 
        flex-1 min-w-0 
        whitespace-normal break-keep
        leading-snug
        pr-2
        overflow-visible
      "
      style={{
        // Máximo de 36 caracteres antes de truncar, mas só quebrar entre palavras
        maxWidth: "60%",
        wordBreak: "keep-all"
      }}
      title={cat.name}
    >
      {cat.name}
    </span>
    <span
      className="
        text-sm text-muted-foreground
        ml-3 flex-shrink-0
        whitespace-nowrap
        font-normal
      "
      style={{
        maxWidth: 150,
      }}
    >
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
