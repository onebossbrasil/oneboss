
import React from "react";
import { AttributeType } from "@/types/category";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

type AttributeListDisplayProps = {
  attributes: AttributeType[];
  selectedAttributeIds?: string[];
  onAttributeToggle?: (attrId: string) => void;
  onEdit?: (attr: AttributeType) => void;
  onDelete?: (attr: AttributeType) => void;
  editable?: boolean;
};

const AttributeListDisplay: React.FC<AttributeListDisplayProps> = ({
  attributes,
  selectedAttributeIds = [],
  onAttributeToggle,
  onEdit,
  onDelete,
  editable = false,
}) => {
  return (
    <div className="flex flex-col space-y-1">
      {attributes.map((attr) => (
        <div key={attr.id} className="flex items-center justify-between p-1 rounded hover:bg-accent transition">
          <Button
            variant="ghost"
            className={`text-left justify-start flex-1 px-2 h-8 font-normal ${
              selectedAttributeIds.includes(attr.id) ? "bg-gold/10 text-gold" : ""
            }`}
            onClick={() => onAttributeToggle && onAttributeToggle(attr.id)}
          >
            {attr.name}
          </Button>
          {editable && (
            <div className="flex items-center ml-2 gap-1">
              <Button variant="ghost" size="icon" onClick={() => onEdit && onEdit(attr)}>
                <Pencil className="h-4 w-4 text-primary" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete && onDelete(attr)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AttributeListDisplay;
