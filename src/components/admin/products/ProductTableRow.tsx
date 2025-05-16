
import { Eye, EyeOff, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Product } from "@/types/product";
import { useProducts } from "@/contexts/ProductContext";
import { useToast } from "@/hooks/use-toast";
import { ReactNode, useState } from "react";
import ProductVisibilityButton from "./ProductVisibilityButton";

interface ProductTableRowProps {
  product: Product;
  onEditClick: (product: Product) => void;
  onSelectDelete: (product: Product) => void;
  isSelectedToDelete?: boolean;
  selectionCheckbox?: ReactNode;
}

const ProductTableRow = ({
  product,
  onEditClick,
  onSelectDelete,
  isSelectedToDelete,
  selectionCheckbox,
}: ProductTableRowProps) => {
  const { updateProduct } = useProducts();
  const { toast } = useToast();
  const [isToggling, setIsToggling] = useState(false);

  // Fix: only update the row, don't refresh the whole list immediately
  const handleVisibilityToggle = async (product: Product) => {
    setIsToggling(true);
    try {
      await updateProduct(product.id, {
        published: !product.published,
      });

      toast({
        title: product.published ? "Produto ocultado" : "Produto publicado",
        description: `${product.name} ${
          product.published ? "não será exibido" : "será exibido"
        } na loja.`,
      });
      // Não há mais refreshProducts automático aqui!
    } catch (error) {
      console.error("Error toggling product visibility:", error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <TableRow className={isSelectedToDelete ? "bg-red-50 dark:bg-red-900/20" : ""}>
      <TableCell className="text-center">
        {selectionCheckbox}
      </TableCell>
      <TableCell>
        {product.images.length > 0 ? (
          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-16 h-16 object-cover rounded-lg"
            style={{ minWidth: 52, minHeight: 52 }}
          />
        ) : (
          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center text-xs text-muted-foreground">
            Sem imagem
          </div>
        )}
      </TableCell>
      <TableCell className="font-medium min-w-[220px] max-w-[360px] whitespace-nowrap overflow-hidden text-ellipsis group relative">
        <span 
          title={product.name}
          className="block overflow-hidden text-ellipsis"
          style={{ maxWidth: 340, display: "inline-block"}}
        >
          {product.name}
        </span>
      </TableCell>
      <TableCell>
        {new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(product.price)}
        {product.salePrice && (
          <div className="text-sm text-muted-foreground line-through">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(product.salePrice)}
          </div>
        )}
      </TableCell>
      <TableCell>{product.stockQuantity}</TableCell>
      {/* Removido a coluna de publicado */}
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <ProductVisibilityButton
            published={product.published}
            onClick={() => handleVisibilityToggle(product)}
            disabled={isToggling}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEditClick(product)}
            title="Editar produto"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onSelectDelete(product)}
            title="Excluir produto"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ProductTableRow;
