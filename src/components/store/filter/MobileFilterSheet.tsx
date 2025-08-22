import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCategories } from "@/contexts/CategoryContext";
import { SubcategoryType } from "@/types/category";
import CategoryItem from "./CategoryItem";
import ActiveFilters from "./ActiveFilters";
import { useState, useEffect } from "react";
import { useCategoryCounters } from "@/hooks/use-category-counters";

interface MobileFilterSheetProps {
  selectedCategory: string | null;
  selectedSubcategories: SubcategoryType[];
  selectedAttributes: any[];
  onCategorySelect: (categoryId: string | null) => void;
  onSubcategoryToggle: (subcategory: SubcategoryType) => void;
  onAttributeToggle: (attribute: any) => void;
  resetFilters: () => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const MobileFilterSheet = ({
  selectedCategory,
  selectedSubcategories,
  selectedAttributes,
  onCategorySelect,
  onSubcategoryToggle,
  onAttributeToggle,
  resetFilters,
  isOpen,
  onOpenChange,
}: MobileFilterSheetProps) => {
  const { categories } = useCategories();
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set());
  
  // Server-side counters
  const {
    getProductCountForCategory,
    getProductCountForSubcategory,
    getProductCountForAttribute,
    loadSubcategoryCounters,
    loadAttributeCounters
  } = useCategoryCounters();

  const currentCategory = selectedCategory
    ? categories.find((cat) => String(cat.id) === String(selectedCategory))
    : null;

  const visibleSubcategories = currentCategory?.subcategories || [];

  // Load subcategory counters when category changes
  useEffect(() => {
    if (selectedCategory) {
      loadSubcategoryCounters(selectedCategory);
    }
  }, [selectedCategory, loadSubcategoryCounters]);

  // Load attribute counters when subcategories change
  useEffect(() => {
    selectedSubcategories.forEach(subcategory => {
      loadAttributeCounters(subcategory.id);
    });
  }, [selectedSubcategories, loadAttributeCounters]);

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

  const isSubcategorySelected = (subcategoryId: string) => {
    return selectedSubcategories.some(subcat => subcat.id === subcategoryId);
  };

  const isAttributeSelected = (attributeId: string) => {
    return selectedAttributes.some(attr => attr.id === attributeId);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="md:hidden border-gold/30 text-gold hover:bg-gold/10">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0 flex flex-col">
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <SheetHeader className="p-6 pb-0">
              <SheetTitle>Filtros</SheetTitle>
              <SheetDescription>
                Encontre exatamente o que você procura
              </SheetDescription>
            </SheetHeader>
            
            <div className="p-6 pt-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full mb-4 border-gold/40 text-gold hover:bg-gold/10"
                onClick={() => {
                  resetFilters();
                  onOpenChange(false);
                }}
              >
                Limpar todos os filtros
              </Button>
            </div>

            <Separator />
            
            <div className="space-y-1 p-6">
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
                    onSubcategoryToggle={onSubcategoryToggle}
                    onAttributeToggle={onAttributeToggle}
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
            
            <div className="px-6 pb-6">
              <ActiveFilters
                selectedSubcategories={selectedSubcategories}
                selectedAttributes={selectedAttributes}
                onSubcategoryToggle={onSubcategoryToggle}
                onAttributeToggle={onAttributeToggle}
              />
            </div>
          </ScrollArea>
        </div>

        <div className="p-6 border-t mt-auto flex-shrink-0 bg-white">
          <Button
            className="w-full bg-gold hover:bg-gold/90 text-white"
            onClick={() => onOpenChange(false)}
          >
            Aplicar Filtros
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileFilterSheet;
