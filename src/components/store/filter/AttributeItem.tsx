
import { Button } from "@/components/ui/button";

interface AttributeItemProps {
  attribute: any;
  isSelected: boolean;
  productCount: number;
  onToggle: (attribute: any) => void;
}

const AttributeItem = ({
  attribute,
  isSelected,
  productCount,
  onToggle,
}: AttributeItemProps) => {
  return (
    <div className="mb-1 ml-4">
      <Button
        variant="ghost"
        className={`justify-start w-full text-left px-3 rounded-md transition-all h-7 text-sm ${
          isSelected 
            ? "bg-gold/20 text-gold font-medium" 
            : "text-gray-600 hover:bg-gold/10 hover:text-gold"
        }`}
        onClick={() => onToggle(attribute)}
      >
        <span className="flex-1 flex items-center justify-between">
          <span>{attribute.attribute}</span>
          <span className="text-xs opacity-60">({productCount})</span>
        </span>
        {isSelected && (
          <span className="ml-2 w-1.5 h-1.5 bg-gold rounded-full"></span>
        )}
      </Button>
    </div>
  );
};

export default AttributeItem;
