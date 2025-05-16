
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";

interface ConfirmDeleteProductModalProps {
  product: Product | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteProductModal({
  product,
  isDeleting,
  onCancel,
  onConfirm
}: ConfirmDeleteProductModalProps) {
  if (!product) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-30">
      <div className="bg-white rounded shadow-lg p-6 dark:bg-gray-900 flex flex-col gap-4 max-w-md w-full">
        <h4 className="font-bold text-lg">Confirmar Exclusão</h4>
        <p>Deseja excluir o produto <b>{product.name}</b>?</p>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={onCancel} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </Button>
        </div>
      </div>
    </div>
  );
}
