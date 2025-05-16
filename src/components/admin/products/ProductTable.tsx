
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProductTableRow from "./ProductTableRow";
import { Product } from "@/types/product";
import ProductTableHeader from "./ProductTableHeader";
import { Checkbox } from "@/components/ui/checkbox";

interface ProductTableProps {
  products: Product[];
  paginatedProducts: Product[];
  selectedIds: string[];
  confirmDelete: Product | null;
  onEditClick: (product: Product) => void;
  onSelectDelete: (product: Product) => void;
  allSelected: boolean;
  onToggleAll: (checked: boolean) => void;
  onToggleProduct: (id: string, checked: boolean) => void;
}

const ProductTable = ({
  products,
  paginatedProducts,
  selectedIds,
  confirmDelete,
  onEditClick,
  onSelectDelete,
  allSelected,
  onToggleAll,
  onToggleProduct,
}: ProductTableProps) => {
  return (
    <Table>
      <TableHeader>
        <ProductTableHeader allSelected={allSelected} onToggleAll={onToggleAll} />
      </TableHeader>
      <TableBody>
        {paginatedProducts.length === 0 ? (
          <TableRow>
            <td colSpan={7} className="text-center py-4 text-muted-foreground">
              Nenhum produto cadastrado
            </td>
          </TableRow>
        ) : (
          paginatedProducts.map((product) => (
            <ProductTableRow
              key={product.id}
              product={product}
              onEditClick={onEditClick}
              onSelectDelete={onSelectDelete}
              isSelectedToDelete={confirmDelete?.id === product.id}
              selectionCheckbox={
                <Checkbox
                  checked={selectedIds.includes(product.id)}
                  onCheckedChange={checked => onToggleProduct(product.id, !!checked)}
                />
              }
            />
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default ProductTable;
