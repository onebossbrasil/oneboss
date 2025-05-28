
import { useMemo } from "react";
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
  onCategorySelect: (categoryId: string | null) => void;
  onSubcategoryToggle: (subcategory: SubcategoryType) => void;
  isMobileFiltersOpen: boolean;
  setIsMobileFiltersOpen: (isOpen: boolean) => void;
  resetFilters: () => void;
  publishedProducts: Product[];
};

const FilterSidebar = ({
  selectedCategory,
  selectedSubcategories,
  onCategorySelect,
  onSubcategoryToggle,
  isMobileFiltersOpen,
  setIsMobileFiltersOpen,
  resetFilters,
  publishedProducts,
}: FilterSidebarProps) => {
  const { categories } = useCategories();

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

  // Verificar se uma subcategoria está selecionada
  const isSubcategorySelected = (subcategoryId: string) => {
    return selectedSubcategories.some(subcat => subcat.id === subcategoryId);
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
                  productCount={productCount}
                  onCategorySelect={onCategorySelect}
                  onSubcategoryToggle={handleSubcategoryToggle}
                  getProductCountForSubcategory={getProductCountForSubcategory}
                  isSubcategorySelected={isSubcategorySelected}
                />
              );
            })}
          </div>
          
          <ActiveFilters
            selectedSubcategories={selectedSubcategories}
            onSubcategoryToggle={handleSubcategoryToggle}
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
