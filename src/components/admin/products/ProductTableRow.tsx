import { Eye, EyeOff, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Product } from "@/types/product";
import { useProducts } from "@/contexts/ProductContext";
import { useToast } from "@/hooks/use-toast";
import { ReactNode } from "react";
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

  const handleVisibilityToggle = async (product: Product) => {
    try {
      await updateProduct(product.id, {
        ...product,
        published: !product.published,
      });

      toast({
        title: product.published ? "Produto ocultado" : "Produto publicado",
        description: `${product.name} ${
          product.published ? "não será exibido" : "será exibido"
        } na loja.`,
      });
    } catch (error) {
      console.error("Error toggling product visibility:", error);
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
      <TableCell className="font-medium max-w-[240px] whitespace-nowrap overflow-hidden text-ellipsis group relative">
        <span 
          title={product.name}
          className="block overflow-hidden text-ellipsis"
          style={{ maxWidth: 220, display: "inline-block"}}
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
      <TableCell className="text-center">
        {product.published ? (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Sim
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Não
          </span>
        )}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <ProductVisibilityButton
            published={product.published}
            onClick={() => handleVisibilityToggle(product)}
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
