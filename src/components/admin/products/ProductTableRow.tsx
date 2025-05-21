
import { Eye, EyeOff, Edit, Trash2, ImageOff } from "lucide-react";
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
  const fallbackImg = "/placeholder.svg";

  // Diagnóstico detalhado
  console.log("[ProductTableRow-DIAG] product.id:", product?.id, "product.images:", product?.images);

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
    } catch (error) {
      console.error("Error toggling product visibility:", error);
    } finally {
      setIsToggling(false);
    }
  };

  // Badge de contagem imagens
  const totalImagens = Array.isArray(product?.images) ? product.images.length : 0;

  return (
    <TableRow
      className={isSelectedToDelete ? "bg-red-50 dark:bg-red-900/20" : ""}
      data-product-id={product.id}
    >
      <TableCell className="text-center">{selectionCheckbox}</TableCell>
      <TableCell>
        <div className="flex gap-1">
          {totalImagens > 0 ? (
            product.images.map((img, index) => (
              <div key={img.id} className="relative">
                <img
                  src={img.url}
                  alt={`Imagem ${index + 1} de ${product.name}`}
                  className="w-10 h-10 object-cover rounded border"
                  style={{ minWidth: 40, minHeight: 40 }}
                  onError={e => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallbackImg;
                  }}
                />
              </div>
            ))
          ) : (
            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center text-xs text-muted-foreground border border-dashed flex-col">
              <ImageOff className="w-6 h-6 mb-1 text-red-400" />
              <span>Nenhuma imagem</span>
            </div>
          )}
          {/* Badge de contagem */}
          <span className="ml-2 px-2 py-0.5 rounded bg-gray-200 text-gray-700 text-xs h-fit self-start">{totalImagens} img</span>
        </div>
        {/* Diagnóstico visual */}
        <div className="mt-1 w-40 max-w-xs overflow-x-auto">
          <pre className="text-[10px] bg-gray-50 text-gray-400 border p-1 rounded">{
            JSON.stringify(product.images, null, 2)
          }</pre>
        </div>
      </TableCell>
      <TableCell className="font-medium min-w-[220px] max-w-[360px] whitespace-nowrap overflow-hidden text-ellipsis group relative">
        <span
          title={product.name}
          className="block overflow-hidden text-ellipsis"
          style={{ maxWidth: 340, display: "inline-block" }}
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
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <ProductVisibilityButton
            published={product.published}
            onClick={() => handleVisibilityToggle(product)}
            disabled={isToggling}
          />
          <Button variant="outline" size="icon" onClick={() => onEditClick(product)} title="Editar produto">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="icon" onClick={() => onSelectDelete(product)} title="Excluir produto">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ProductTableRow;

