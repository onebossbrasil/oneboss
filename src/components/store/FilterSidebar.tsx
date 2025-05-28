
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCategories } from "@/contexts/CategoryContext";
import { SubcategoryType } from "@/types/category";
import { Product } from "@/types/product";
import FilterSidebarHeader from "./filter/FilterSidebarHeader";
import CategoryItem from "./filter/CategoryItem";
import ActiveFilters from "./filter/ActiveFilters";

type FilterSidebarProps = {
  selectedCategory: string | null;
  selectedSubcategories: SubcategoryType[];
  selectedAttributes: any[];
  onCategorySelect: (categoryId: string | null) => void;
  onSubcategoryToggle: (subcategory: SubcategoryType) => void;
  onAttributeToggle: (attribute: any) => void;
  isMobileFiltersOpen: boolean;
  setIsMobileFiltersOpen: (isOpen: boolean) => void;
  resetFilters: () => void;
  publishedProducts: Product[];
};

const FilterSidebar = ({
  selectedCategory,
  selectedSubcategories,
  selectedAttributes,
  onCategorySelect,
  onSubcategoryToggle,
  onAttributeToggle,
  resetFilters,
  publishedProducts,
}: FilterSidebarProps) => {
  const { categories } = useCategories();
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set());

  const currentCategory = selectedCategory
    ? categories.find((cat) => String(cat.id) === String(selectedCategory))
    : null;

  const visibleSubcategories = useMemo(() => {
    if (!currentCategory) return [];
    return currentCategory.subcategories || [];
  }, [currentCategory]);

  const handleSubcategoryToggle = (subcategory: SubcategoryType) => {
    onSubcategoryToggle(subcategory);
  };

  const handleAttributeToggle = (attribute: any) => {
    onAttributeToggle(attribute);
  };

  const isSubcategorySelected = (subcategoryId: string) => {
    return selectedSubcategories.some(subcat => subcat.id === subcategoryId);
  };

  const isAttributeSelected = (attributeId: string) => {
    return selectedAttributes.some(attr => attr.id === attributeId);
  };

  const handleSubcategoryExpandToggle = (subcategoryId: string) => {
    const newExpanded = new Set(expandedSubcategories);
    if (newExpanded.has(subcategoryId)) {
      newExpanded.delete(subcategoryId);
    } else {
      newExpanded.add(subcategoryId);
    }
    setExpandedSubcategories(newExpanded);
  };

  const getAttributesForSubcategory = (subcategoryId: string) => {
    const subcategory = currentCategory?.subcategories.find(sub => sub.id === subcategoryId);
    return subcategory?.attributes || [];
  };

  const getProductCountForCategory = (categoryId: string) => {
    return publishedProducts.filter(product => 
      String(product.categoryId) === String(categoryId)
    ).length;
  };

  const getProductCountForSubcategory = (subcategoryId: string) => {
    return publishedProducts.filter(product => 
      String(product.subcategoryId) === String(subcategoryId)
    ).length;
  };

  const getProductCountForAttribute = (attributeId: string) => {
    return publishedProducts.filter(product => 
      String(product.attributeId) === String(attributeId)
    ).length;
  };

  return (
    <div className="bg-white rounded-xl border border-gold/10 shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="font-semibold text-xl mb-2">Filtros</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Encontre exatamente o que você procura
        </p>
        <Button
          variant="outline"
          size="sm"
          className="w-full border-gold/40 text-gold hover:bg-gold/10"
          onClick={resetFilters}
        >
          Limpar todos os filtros
        </Button>
      </div>
      
      <Separator />
      
      <ScrollArea className="h-[calc(100vh-300px)] p-6">
        <div className="space-y-2 mb-6">
          {categories.map((category) => {
            const productCount = getProductCountForCategory(category.id);
            const isSelected = selectedCategory === category.id;
            
            return (
              <CategoryItem
                key={category.id}
                category={category}
                isSelected={isSelected}
                visibleSubcategories={visibleSubcategories}
                selectedSubcategories={selectedSubcategories}
                selectedAttributes={selectedAttributes}
                productCount={productCount}
                onCategorySelect={onCategorySelect}
                onSubcategoryToggle={handleSubcategoryToggle}
                onAttributeToggle={handleAttributeToggle}
                getProductCountForSubcategory={getProductCountForSubcategory}
                getProductCountForAttribute={getProductCountForAttribute}
                isSubcategorySelected={isSubcategorySelected}
                isAttributeSelected={isAttributeSelected}
                expandedSubcategories={expandedSubcategories}
                onSubcategoryExpandToggle={handleSubcategoryExpandToggle}
                getAttributesForSubcategory={getAttributesForSubcategory}
              />
            );
          })}
        </div>
        
        <ActiveFilters
          selectedSubcategories={selectedSubcategories}
          selectedAttributes={selectedAttributes}
          onSubcategoryToggle={handleSubcategoryToggle}
          onAttributeToggle={handleAttributeToggle}
        />
      </ScrollArea>
    </div>
  );
};

export default FilterSidebar;
