
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarFooter } from "@/components/ui/sidebar";
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
  isMobileFiltersOpen,
  setIsMobileFiltersOpen,
  resetFilters,
  publishedProducts,
}: FilterSidebarProps) => {
  const { categories } = useCategories();
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set());

  // Buscar a categoria selecionada pelo id (UUID)
  const currentCategory = selectedCategory
    ? categories.find((cat) => String(cat.id) === String(selectedCategory))
    : null;

  // Exibir todas as subcategorias da categoria selecionada
  const visibleSubcategories = useMemo(() => {
    if (!currentCategory) return [];
    return currentCategory.subcategories || [];
  }, [currentCategory]);

  // Handler para toggle subcategoria: passa o objeto subcategoria completo
  const handleSubcategoryToggle = (subcategory: SubcategoryType) => {
    console.log(`[FilterSidebar] Toggle subcategoria:`, subcategory);
    onSubcategoryToggle(subcategory);
  };

  // Handler para toggle atributo
  const handleAttributeToggle = (attribute: any) => {
    console.log(`[FilterSidebar] Toggle atributo:`, attribute);
    onAttributeToggle(attribute);
  };

  // Verificar se uma subcategoria está selecionada
  const isSubcategorySelected = (subcategoryId: string) => {
    return selectedSubcategories.some(subcat => subcat.id === subcategoryId);
  };

  // Verificar se um atributo está selecionado
  const isAttributeSelected = (attributeId: string) => {
    return selectedAttributes.some(attr => attr.id === attributeId);
  };

  // Controlar expansão de subcategorias
  const handleSubcategoryExpandToggle = (subcategoryId: string) => {
    const newExpanded = new Set(expandedSubcategories);
    if (newExpanded.has(subcategoryId)) {
      newExpanded.delete(subcategoryId);
    } else {
      newExpanded.add(subcategoryId);
    }
    setExpandedSubcategories(newExpanded);
  };

  // Buscar atributos de uma subcategoria
  const getAttributesForSubcategory = (subcategoryId: string) => {
    const subcategory = currentCategory?.subcategories.find(sub => sub.id === subcategoryId);
    return subcategory?.attributes || [];
  };

  // Contar produtos por categoria
  const getProductCountForCategory = (categoryId: string) => {
    return publishedProducts.filter(product => 
      String(product.categoryId) === String(categoryId)
    ).length;
  };

  // Contar produtos por subcategoria
  const getProductCountForSubcategory = (subcategoryId: string) => {
    return publishedProducts.filter(product => 
      String(product.subcategoryId) === String(subcategoryId)
    ).length;
  };

  // Contar produtos por atributo
  const getProductCountForAttribute = (attributeId: string) => {
    return publishedProducts.filter(product => 
      String(product.attributeId) === String(attributeId)
    ).length;
  };

  return (
    <>
      <aside
        className={`fixed md:static inset-0 z-40 bg-background/95 md:bg-[#F6F6F7] backdrop-blur-md 
        md:backdrop-blur-none md:w-64 flex-shrink-0 md:glassmorphism p-6 rounded-lg self-start 
        md:sticky md:top-24 transition-all duration-300 transform 
        ${isMobileFiltersOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        overflow-auto max-h-screen md:max-h-[calc(100vh-120px)] md:block border-r border-gray-200 shadow`}
      >
        <FilterSidebarHeader
          isMobile={!isMobileFiltersOpen}
          onClose={() => setIsMobileFiltersOpen(false)}
          onResetFilters={resetFilters}
        />
        
        <Separator className="mb-4" />
        
        <ScrollArea className="h-[400px] pr-4">
          {/* Categorias */}
          <div className="space-y-1 mb-6">
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
        
        <SidebarFooter className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border md:hidden">
          <Button
            className="w-full bg-gold hover:bg-gold-light text-white"
            onClick={() => setIsMobileFiltersOpen(false)}
          >
            Aplicar Filtros
          </Button>
        </SidebarFooter>
      </aside>
      {isMobileFiltersOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setIsMobileFiltersOpen(false)}
        />
      )}
    </>
  );
};

export default FilterSidebar;
