
import React from "react";
import { AttributeType } from "@/types/category";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

type AttributeListDisplayProps = {
  attributes: AttributeType[];
  selectedAttributes?: AttributeType[];
  onAttributeToggle?: (attr: AttributeType) => void;
  onEdit?: (attr: AttributeType) => void;
  onDelete?: (attr: AttributeType) => void;
  editable?: boolean;
  unifedStyles?: boolean; // Para sidebar loja padronizado
};

const AttributeListDisplay: React.FC<AttributeListDisplayProps> = ({
  attributes,
  selectedAttributes = [],
  onAttributeToggle,
  onEdit,
  onDelete,
  editable = false,
  unifedStyles = false,
}) => {
  const isSelected = (attr: AttributeType) =>
    selectedAttributes.some((a) => a.id === attr.id);

  // Classes para visual unificado do sidebar de filtros
  const attrBtnBase =
    "w-full flex items-center justify-between text-left px-2 rounded-md transition-all h-8 text-sm";
  const attrActive = "bg-gold/90 text-white font-semibold"; // text-white on gold background
  const attrHover = "hover:bg-gold/10 hover:text-gold";
  const attrNormal = "text-gray-700";

  return (
    <div className="flex flex-col space-y-1">
      {attributes.map((attr) => (
        <div
          key={attr.id}
          className={
            unifedStyles
              ? ""
              : "flex items-center justify-between p-1 rounded hover:bg-accent transition"
          }
        >
          <Button
            variant="ghost"
            className={
              unifedStyles
                ? `${attrBtnBase} ${
                    isSelected(attr) ? attrActive : attrNormal
                  } ${attrHover}`
                : `text-left justify-start flex-1 px-2 h-8 font-normal ${
                    isSelected(attr) ? "bg-gold/90 text-white" : ""
                  }`
            }
            onClick={() => onAttributeToggle && onAttributeToggle(attr)}
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
