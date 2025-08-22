import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCategories } from "@/contexts/CategoryContext";
import { SubcategoryType } from "@/types/category";
import { Product } from "@/types/product";
import FilterSidebarHeader from "./filter/FilterSidebarHeader";
import CategoryItem from "./filter/CategoryItem";
import ActiveFilters from "./filter/ActiveFilters";
import { useCategoryCounters } from "@/hooks/use-category-counters";

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
};

const FilterSidebar = ({
  selectedCategory,
  selectedSubcategories,
  selectedAttributes,
  onCategorySelect,
  onSubcategoryToggle,
  onAttributeToggle,
  resetFilters,
}: FilterSidebarProps) => {
  const { categories } = useCategories();
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set());
  
  // Contadores server-side
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

  // Carrega contadores de subcategorias quando categoria é selecionada
  useEffect(() => {
    if (selectedCategory) {
      loadSubcategoryCounters(selectedCategory);
    }
  }, [selectedCategory, loadSubcategoryCounters]);

  const visibleSubcategories = useMemo(() => {
    if (!currentCategory) return [];
    
    // Debug específico para categoria IMÓVEIS
    if (currentCategory.name === "Imóveis") {
      console.log(`[FilterSidebar] ===== DEBUG CATEGORIA IMÓVEIS =====`);
      console.log(`[FilterSidebar] Categoria IMÓVEIS encontrada:`, {
        id: currentCategory.id,
        name: currentCategory.name,
        subcategoriesCount: currentCategory.subcategories?.length || 0,
        subcategories: currentCategory.subcategories
      });
      
      if (currentCategory.subcategories && currentCategory.subcategories.length > 0) {
        console.log(`[FilterSidebar] Subcategorias IMÓVEIS:`, 
          currentCategory.subcategories.map(sub => ({
            id: sub.id,
            name: sub.name,
            attributesCount: sub.attributes?.length || 0,
            attributes: sub.attributes
          }))
        );
      } else {
        console.log(`[FilterSidebar] ❌ PROBLEMA: Categoria IMÓVEIS sem subcategorias!`);
      }
    }
    
    return currentCategory.subcategories || [];
  }, [currentCategory]);

  // Debug: Log sempre que selectedCategory mudar
  console.log(`[FilterSidebar] ===== CATEGORIA SELECIONADA =====`);
  console.log(`[FilterSidebar] selectedCategory:`, selectedCategory);
  console.log(`[FilterSidebar] currentCategory:`, currentCategory?.name);
  console.log(`[FilterSidebar] visibleSubcategories count:`, visibleSubcategories.length);
  console.log(`[FilterSidebar] Total categories loaded:`, categories.length);
  console.log(`[FilterSidebar] Categories:`, categories.map(c => ({ 
    id: c.id, 
    name: c.name, 
    subsCount: c.subcategories?.length || 0,
    subcategories: c.subcategories?.map(sub => ({
      id: sub.id,
      name: sub.name,
      attributesCount: sub.attributes?.length || 0
    }))
  })));

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

  // Load attribute counters when subcategory changes
  useEffect(() => {
    selectedSubcategories.forEach(subcategory => {
      loadAttributeCounters(subcategory.id);
    });
  }, [selectedSubcategories, loadAttributeCounters]);

  return (
    <div className="bg-white rounded-xl border border-gold/10 shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 flex-shrink-0">
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
      
      <ScrollArea className="flex-1 min-h-0 max-h-[70vh] md:max-h-[calc(100vh-300px)] p-6 overflow-y-auto">
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
