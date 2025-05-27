
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type Props = {
  subcategoryName?: string;
  canAdd: boolean;
  adding: boolean;
  setAdding: (val: boolean) => void;
};

const AttributeListHeader = ({
  subcategoryName,
  canAdd,
  adding,
  setAdding,
}: Props) => (
  <div className="flex justify-between items-center flex-wrap gap-2">
    <h3 className="text-lg font-medium">
      {subcategoryName ? `Atributos: ${subcategoryName}` : "Atributos"}
    </h3>
    {canAdd && (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setAdding(!adding)}
        className="h-9"
      >
        <Plus className="h-4 w-4 mr-1" /> Novo
      </Button>
    )}
  </div>
);

export default AttributeListHeader;
