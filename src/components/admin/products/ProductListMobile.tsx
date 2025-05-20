
import { Product } from "@/types/product";
import ProductListMobileItem from "./ProductListMobileItem";

interface ProductListMobileProps {
  products: Product[];
  selectedIds: string[];
  onEditClick: (product: Product) => void;
  onSelectDelete: (product: Product) => void;
  onToggleProduct: (id: string, checked: boolean) => void;
  confirmDelete: Product | null;
}

const ProductListMobile = ({
  products,
  selectedIds,
  onEditClick,
  onSelectDelete,
  onToggleProduct,
  confirmDelete,
}: ProductListMobileProps) => {
  if (products.length === 0) {
    return (
      <div className="w-full text-center text-muted-foreground py-8">
        Nenhum produto cadastrado
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3 w-full pb-24">
      {products.map((product) => (
        <ProductListMobileItem
          key={product.id}
          product={product}
          checked={selectedIds.includes(product.id)}
          onCheckChange={checked => onToggleProduct(product.id, checked)}
          onEditClick={() => onEditClick(product)}
          onSelectDelete={() => onSelectDelete(product)}
          isSelectedToDelete={confirmDelete?.id === product.id}
        />
      ))}
    </ul>
  );
};

export default ProductListMobile;
