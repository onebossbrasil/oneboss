
import { Product } from "@/types/product";
import ProductVisibilityButton from "./ProductVisibilityButton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2 } from "lucide-react";

interface ProductListMobileItemProps {
  product: Product;
  checked: boolean;
  onCheckChange: (checked: boolean) => void;
  onEditClick: () => void;
  onSelectDelete: () => void;
  isSelectedToDelete?: boolean;
}

const ProductListMobileItem = ({
  product,
  checked,
  onCheckChange,
  onEditClick,
  onSelectDelete,
  isSelectedToDelete,
}: ProductListMobileItemProps) => {
  return (
    <li className={`rounded-xl border shadow bg-white relative ${isSelectedToDelete ? "border-red-300 bg-red-50" : "border-gray-200"}`}>
      <div className="flex items-stretch gap-3 px-3 py-2">
        <div className="flex flex-col items-center justify-between">
          <Checkbox
            checked={checked}
            onCheckedChange={onCheckChange}
          />
        </div>
        <div className="flex-shrink-0">
          {product.images?.[0]?.url ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-lg border bg-muted"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg flex items-center justify-center text-xs text-muted-foreground bg-muted">
              Sem imagem
            </div>
          )}
        </div>
        <div className="flex flex-col flex-1 justify-center min-w-0">
          <div className="font-medium text-base truncate" title={product.name}>
            {product.name}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(product.price)}
          </div>
          <div className="text-xs text-muted-foreground">
            Estoque: {product.stockQuantity}
          </div>
        </div>
        {/* Ícones de ação: PUBLICAR, EDITAR, EXCLUIR no canto direito */}
        <div className="flex flex-col items-end justify-between pl-2">
          <div className="flex gap-2">
            <ProductVisibilityButton
              published={product.published}
              onClick={() => onEditClick()} // Permanece: clicando abre edição de publicação.
            />
            <Button
              variant="outline"
              size="icon"
              onClick={onEditClick}
              title="Editar produto"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={onSelectDelete}
              title="Excluir produto"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default ProductListMobileItem;
