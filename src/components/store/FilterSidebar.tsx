
import { useState, useMemo } from "react";
import { X, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { useCategories } from "@/contexts/CategoryContext";
import { SubcategoryType } from "@/types/category";
import { Product } from "@/types/product";

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
        <SidebarHeader className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Filtros</h2>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-muted-foreground"
              onClick={() => setIsMobileFiltersOpen(false)}
            >
              <X size={18} />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 text-xs w-full border-gold/40 text-gold hover:bg-gold/10 hover:text-gold"
            onClick={resetFilters}
          >
            Limpar Filtros
          </Button>
        </SidebarHeader>
        <Separator className="mb-4" />
        <ScrollArea className="h-[400px] pr-4">
          {/* Categorias */}
          <div className="space-y-1 mb-6">
            {categories.map((category) => {
              const productCount = getProductCountForCategory(category.id);
              const isSelected = selectedCategory === category.id;
              
              return (
                <div key={category.id}>
                  {/* Categoria */}
                  <Button
                    variant="ghost"
                    className={`w-full flex items-center justify-between text-left rounded-md transition-all px-2 h-9 text-base ${
                      isSelected 
                        ? "bg-gold/90 text-white font-bold shadow" 
                        : "text-gray-700 hover:bg-gold/10 hover:text-gold"
                    }`}
                    onClick={() => {
                      console.log(`[FilterSidebar] Categoria clicada: ${category.id}`);
                      if (selectedCategory === category.id) {
                        onCategorySelect(null);
                      } else {
                        onCategorySelect(category.id);
                      }
                    }}
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
                  {selectedCategory === category.id && visibleSubcategories.length > 0 && (
                    <div className="mt-2 mb-2 ml-4">
                      {visibleSubcategories.map((subcategory) => {
                        const isSubSelected = isSubcategorySelected(subcategory.id);
                        const productCount = getProductCountForSubcategory(subcategory.id);
                        
                        return (
                          <div key={subcategory.id} className="mb-1">
                            {/* Subcategoria */}
                            <Button
                              variant="ghost"
                              className={`justify-start w-full text-left px-3 rounded-md transition-all h-8 ${
                                isSubSelected 
                                  ? "bg-gold/15 text-gold font-semibold" 
                                  : "text-gray-700 hover:bg-gold/10 hover:text-gold"
                              }`}
                              onClick={() => handleSubcategoryToggle(subcategory)}
                            >
                              <span className="flex-1 flex items-center justify-between">
                                <span>{subcategory.name}</span>
                                <span className="text-xs opacity-60">({productCount})</span>
                              </span>
                              {isSubSelected && (
                                <span className="ml-2 w-2 h-2 bg-gold rounded-full"></span>
                              )}
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Filtros ativos */}
          {selectedSubcategories.length > 0 && (
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
                      onClick={() => handleSubcategoryToggle(subcategory)}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
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
