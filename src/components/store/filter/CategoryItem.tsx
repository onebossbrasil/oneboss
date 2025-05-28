
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { CategoryType } from "@/types/category";
import SubcategoryItem from "./SubcategoryItem";

interface CategoryItemProps {
  category: CategoryType;
  isSelected: boolean;
  visibleSubcategories: any[];
  selectedSubcategories: any[];
  selectedAttributes: any[];
  productCount: number;
  onCategorySelect: (categoryId: string | null) => void;
  onSubcategoryToggle: (subcategory: any) => void;
  onAttributeToggle: (attribute: any) => void;
  getProductCountForSubcategory: (subcategoryId: string) => number;
  getProductCountForAttribute: (attributeId: string) => number;
  isSubcategorySelected: (subcategoryId: string) => boolean;
  isAttributeSelected: (attributeId: string) => boolean;
  expandedSubcategories: Set<string>;
  onSubcategoryExpandToggle: (subcategoryId: string) => void;
  getAttributesForSubcategory: (subcategoryId: string) => any[];
}

const CategoryItem = ({
  category,
  isSelected,
  visibleSubcategories,
  selectedSubcategories,
  selectedAttributes,
  productCount,
  onCategorySelect,
  onSubcategoryToggle,
  onAttributeToggle,
  getProductCountForSubcategory,
  getProductCountForAttribute,
  isSubcategorySelected,
  isAttributeSelected,
  expandedSubcategories,
  onSubcategoryExpandToggle,
  getAttributesForSubcategory,
}: CategoryItemProps) => {
  const handleCategoryClick = () => {
    console.log(`[FilterSidebar] Categoria clicada: ${category.id}`);
    if (isSelected) {
      onCategorySelect(null);
    } else {
      onCategorySelect(category.id);
    }
  };

  return (
    <div>
      {/* Categoria */}
      <Button
        variant="ghost"
        className={`w-full flex items-center justify-between text-left rounded-md transition-all px-2 h-9 text-base ${
          isSelected 
            ? "bg-gold/90 text-white font-bold shadow" 
            : "text-gray-700 hover:bg-gold/10 hover:text-gold"
        }`}
        onClick={handleCategoryClick}
      >
        <span className="flex-1 flex items-center justify-between">
          <span>{category.name}</span>
          <span className="text-xs opacity-60">({productCount})</span>
        </span>
        <span className={`ml-1 transition-colors ${
          isSelected ? "text-white" : "text-gray-400"
        }`}>
          {isSelected ? (
            <ChevronDown size={18} />
          ) : (
            <ChevronRight size={18} />
          )}
        </span>
      </Button>
      
      {/* Subcategorias da categoria selecionada */}
      {isSelected && visibleSubcategories.length > 0 && (
        <div className="mt-2 mb-2 ml-4">
          {visibleSubcategories.map((subcategory) => (
            <SubcategoryItem
              key={subcategory.id}
              subcategory={subcategory}
              isSelected={isSubcategorySelected(subcategory.id)}
              productCount={getProductCountForSubcategory(subcategory.id)}
              onToggle={onSubcategoryToggle}
              attributes={getAttributesForSubcategory(subcategory.id)}
              selectedAttributes={selectedAttributes}
              onAttributeToggle={onAttributeToggle}
              getProductCountForAttribute={getProductCountForAttribute}
              isAttributeSelected={isAttributeSelected}
              isExpanded={expandedSubcategories.has(subcategory.id)}
              onExpandToggle={onSubcategoryExpandToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryItem;
