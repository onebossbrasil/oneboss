
import React from "react";
import { Button } from "@/components/ui/button";

interface ProductEditActionsProps {
  onCancel: () => void;
  isSubmitting?: boolean;
}

const ProductEditActions: React.FC<ProductEditActionsProps> = ({ 
  onCancel, 
  isSubmitting = false 
}) => {
  return (
    <div className="flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Salvar Alterações"}
      </Button>
    </div>
  );
};

export default ProductEditActions;
