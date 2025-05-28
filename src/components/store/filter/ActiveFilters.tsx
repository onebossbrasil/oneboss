
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ActiveFiltersProps {
  selectedSubcategories: any[];
  onSubcategoryToggle: (subcategory: any) => void;
}

const ActiveFilters = ({
  selectedSubcategories,
  onSubcategoryToggle,
}: ActiveFiltersProps) => {
  if (selectedSubcategories.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="font-medium text-sm text-gray-700 mb-3">Filtros Ativos:</h3>
      <div className="space-y-2">
        {selectedSubcategories.map((subcategory) => (
          <div key={subcategory.id} className="flex items-center justify-between bg-gold/10 px-3 py-2 rounded-md">
            <span className="text-sm text-gold font-medium">{subcategory.name}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 text-gold hover:bg-gold/20"
              onClick={() => onSubcategoryToggle(subcategory)}
            >
              <X size={14} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveFilters;
