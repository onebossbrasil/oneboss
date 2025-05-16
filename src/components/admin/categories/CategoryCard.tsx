
import { Folder, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const CategoryCard = ({
  cat,
  selected,
  onSelect,
  onRemove,
  deleting
}: Props) => (
  <div
    className={`
      flex flex-col justify-between bg-white rounded-xl shadow-md transition-all
      hover:shadow-lg hover:border-primary
      ${selected ? "border-2 border-primary bg-primary/10" : "border border-border"}
      p-4 cursor-pointer relative group
      min-h-[110px]
      max-w-[330px]
      w-full
      box-border
      focus:outline-none
    `}
    tabIndex={0}
    aria-selected={selected}
    onClick={onSelect}
    style={{
      wordBreak: "normal",
      whiteSpace: "normal",
      overflowWrap: "break-word"
    }}
  >
    {/* Top: ícone + nome + botão de deletar */}
    <div className="flex flex-row justify-between items-start mb-1">
      <div className="flex items-center gap-3 w-full min-w-0">
        <div className="flex items-center justify-center rounded-full bg-primary/10 p-3">
          <Folder className="h-6 w-6 text-primary flex-shrink-0" />
        </div>
        <span
          className="text-base font-semibold text-foreground leading-tight truncate block"
          style={{
            fontSize: "1.08rem",
            maxWidth: 160,
            textAlign: "left"
          }}
          title={cat.name}
        >
          {cat.name}
        </span>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        tabIndex={-1}
        onClick={e => {
          e.stopPropagation();
          onRemove(cat.id);
        }}
        disabled={deleting}
        className="text-red-500 hover:text-red-700 hover:bg-red-50 opacity-60 group-hover:opacity-100 transition"
        aria-label="Excluir categoria"
      >
        {deleting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Trash2 className="h-5 w-5" />
        )}
      </Button>
    </div>
    {/* Subcategoria contador */}
    <div className="flex flex-row justify-end items-end mt-6">
      <span className="
        text-xs px-2 py-1 rounded-md bg-muted/80 text-muted-foreground font-medium tracking-wide
      ">
        {cat.subcategories.length} {cat.subcategories.length === 1 ? "subcategoria" : "subcategorias"}
      </span>
    </div>
    {/* Selecionada */}
    {selected && (
      <span className="absolute right-3 top-3 text-primary text-xs font-medium px-2 py-1 bg-primary/20 rounded-md pointer-events-none shadow">
        Selecionada
      </span>
    )}
  </div>
);

export default CategoryCard;

