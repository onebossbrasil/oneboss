
import { Product } from "@/types/product";
import ProductVisibilityButton from "./ProductVisibilityButton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2, ImageOff } from "lucide-react";

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
  const fallbackImg = "/placeholder.svg";
  // Ajuste condicional: impedir SVG e URL inválida
  const hasImg =
    Array.isArray(product?.images) &&
    product.images.length > 0 &&
    typeof product.images[0]?.url === "string" &&
    product.images[0].url.trim() !== "" &&
    !product.images[0].url.endsWith(".svg");
  const imgUrl = hasImg ? product.images[0].url : "";

  // Diagnóstico: log das imagens recebidas
  console.log("[ProductListMobileItem] product.images=", product?.images);

  return (
    <li className={`rounded-xl border shadow bg-white relative ${isSelectedToDelete ? "border-red-300 bg-red-50" : "border-gray-200"}`}>
      <div className="flex items-stretch gap-3 px-3 py-2">
        <div className="flex flex-col items-center justify-between">
          <Checkbox
            checked={checked}
            onCheckedChange={onCheckChange}
          />
        </div>
        <div className="flex flex-col items-center">
          <div className="flex gap-1 overflow-x-auto max-w-[140px]">
            {hasImg ? (
              <img
                src={imgUrl}
                alt={`Imagem de ${product.name}`}
                className="w-10 h-10 object-cover rounded border"
                onError={e => {
                  console.error("Erro ao carregar imagem:", imgUrl, e.nativeEvent);
                  (e.currentTarget as HTMLImageElement).src = fallbackImg;
                }}
              />
            ) : (
              <div className="w-16 h-16 rounded-lg flex items-center justify-center text-xs text-muted-foreground bg-muted flex-col border">
                <ImageOff className="w-6 h-6 mb-1 text-red-400" />
                {/* AVISO DEBUG */}
                {product.images && product.images.length > 0
                  ? "URL inválida ou formato não suportado"
                  : "Sem imagem"}
              </div>
            )}
          </div>
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
      </div>
      <div className="flex justify-end items-center border-t pt-2 px-3 pb-2 gap-2">
        <ProductVisibilityButton
          published={product.published}
          onClick={() => onEditClick()}
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
    </li>
  );
};

export default ProductListMobileItem;
