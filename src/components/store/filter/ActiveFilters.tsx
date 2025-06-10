
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ActiveFiltersProps {
  selectedSubcategories: any[];
  selectedAttributes: any[];
  onSubcategoryToggle: (subcategory: any) => void;
  onAttributeToggle: (attribute: any) => void;
}

const ActiveFilters = ({
  selectedSubcategories,
  selectedAttributes,
  onSubcategoryToggle,
  onAttributeToggle,
}: ActiveFiltersProps) => {
  const hasActiveFilters = selectedSubcategories.length > 0 || selectedAttributes.length > 0;

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="font-medium text-sm text-gray-700 mb-3">Filtros Ativos:</h3>
      <div className="space-y-2">
        {/* Subcategorias selecionadas */}
        {selectedSubcategories.map((subcategory) => (
          <div key={`sub-${subcategory.id}`} className="flex items-center justify-between bg-gold/10 px-3 py-2 rounded-md">
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
        
        {/* CORREÇÃO: Atributos selecionados - usar 'name' em vez de 'attribute' */}
        {selectedAttributes.map((attribute) => (
          <div key={`attr-${attribute.id}`} className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-md">
            <span className="text-sm text-blue-700 font-medium">{attribute.name}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 text-blue-700 hover:bg-blue-100"
              onClick={() => onAttributeToggle(attribute)}
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
