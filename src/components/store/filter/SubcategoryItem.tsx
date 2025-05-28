
import { Button } from "@/components/ui/button";

interface SubcategoryItemProps {
  subcategory: any;
  isSelected: boolean;
  productCount: number;
  onToggle: (subcategory: any) => void;
}

const SubcategoryItem = ({
  subcategory,
  isSelected,
  productCount,
  onToggle,
}: SubcategoryItemProps) => {
  return (
    <div className="mb-1">
      <Button
        variant="ghost"
        className={`justify-start w-full text-left px-3 rounded-md transition-all h-8 ${
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
    </div>
  );
};

export default SubcategoryItem;
