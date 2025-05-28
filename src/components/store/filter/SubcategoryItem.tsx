
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import AttributeItem from "./AttributeItem";

interface SubcategoryItemProps {
  subcategory: any;
  isSelected: boolean;
  productCount: number;
  onToggle: (subcategory: any) => void;
  attributes: any[];
  selectedAttributes: any[];
  onAttributeToggle: (attribute: any) => void;
  getProductCountForAttribute: (attributeId: string) => number;
  isAttributeSelected: (attributeId: string) => boolean;
  isExpanded: boolean;
  onExpandToggle: (subcategoryId: string) => void;
}

const SubcategoryItem = ({
  subcategory,
  isSelected,
  productCount,
  onToggle,
  attributes,
  selectedAttributes,
  onAttributeToggle,
  getProductCountForAttribute,
  isAttributeSelected,
  isExpanded,
  onExpandToggle,
}: SubcategoryItemProps) => {
  const hasAttributes = attributes && attributes.length > 0;

  return (
    <div className="mb-1">
      <div className="flex items-center">
        <Button
          variant="ghost"
          className={`justify-start flex-1 text-left px-3 rounded-md transition-all h-8 ${
            isSelected 
              ? "bg-gold/15 text-gold font-semibold" 
              : "text-gray-700 hover:bg-gold/10 hover:text-gold"
          }`}
          onClick={() => onToggle(subcategory)}
        >
          <span className="flex-1 flex items-center justify-between">
            <span>{subcategory.name}</span>
            <span className="text-xs opacity-60">({productCount})</span>
          </span>
          {isSelected && (
            <span className="ml-2 w-2 h-2 bg-gold rounded-full"></span>
          )}
        </Button>
        
        {hasAttributes && (
          <Button
            variant="ghost"
            size="sm"
            className="ml-1 p-1 h-8 w-8"
            onClick={() => onExpandToggle(subcategory.id)}
          >
            {isExpanded ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
          </Button>
        )}
      </div>
      
      {/* Atributos da subcategoria expandida */}
      {hasAttributes && isExpanded && (
        <div className="mt-1 mb-2">
          {attributes.map((attribute) => (
            <AttributeItem
              key={attribute.id}
              attribute={attribute}
              isSelected={isAttributeSelected(attribute.id)}
              productCount={getProductCountForAttribute(attribute.id)}
              onToggle={onAttributeToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SubcategoryItem;
