
import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { useCategories } from "@/contexts/CategoryContext";
import { SubcategoryType, AttributeType } from "@/types/category";
import { Product } from "@/types/product";

type FilterSidebarProps = {
  selectedCategory: string | null;
  selectedSubcategories: string[];
  onCategorySelect: (categoryId: string) => void;
  onSubcategoryToggle: (subcategory: string) => void;
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
  publishedProducts
}: FilterSidebarProps) => {
  const { categories } = useCategories();

  // Get subcategories for the selected category
  const getSubcategories = () => {
    if (!selectedCategory) return [];
    const category = categories.find(cat => cat.value === selectedCategory);
    if (!category) return [];
    return category.subcategories || [];
  };

  // Subcategory will be visible if at least ONE published product has subcategoryValue equal to any of its attributes
  const getActiveSubcategories = (): SubcategoryType[] => {
    const subcategories = getSubcategories();

    return subcategories
      .map((subcat) => {
        // For each attribute of the subcategory:
        const activeAttributes = subcat.attributes.filter((attr: AttributeType) =>
          publishedProducts.some(
            (product) =>
              product.subcategoryValues &&
              Object.values(product.subcategoryValues).includes(attr.id)
          )
        );
        // Only return subcategory if there is at least 1 active attribute
        return activeAttributes.length > 0
          ? {
              ...subcat,
              attributes: activeAttributes
            }
          : null;
      })
      .filter((item): item is SubcategoryType => !!item);
  };

  const subcategories = getActiveSubcategories();

  return (
    <>
      <aside className={`fixed md:static inset-0 z-40 bg-background/95 md:bg-transparent backdrop-blur-md md:backdrop-blur-none md:w-64 flex-shrink-0 md:glassmorphism p-6 rounded-lg self-start md:sticky md:top-24 transition-all duration-300 transform ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} overflow-auto max-h-screen md:max-h-[calc(100vh-120px)] md:block`}>
        <SidebarHeader className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Filtros</h2>
            <Button variant="ghost" size="sm" className="md:hidden text-muted-foreground" onClick={() => setIsMobileFiltersOpen(false)}>
              <X size={18} />
            </Button>
          </div>
          <Button variant="outline" size="sm" className="mt-4 text-xs w-full border-gold/40 text-gold hover:bg-gold/10 hover:text-gold" onClick={resetFilters}>
            Limpar Filtros
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <div className="space-y-6">
            <h3 className="font-medium">Categorias</h3>
            <ScrollArea className="h-[400px] pr-4">
              {/* Categories */}
              <div className="space-y-1 mb-6">
                {categories.map(category => (
                  <div key={category.id} className="flex flex-col">
                    <Button
                      variant="ghost"
                      className={`justify-start font-normal h-8 px-2 w-full text-left ${selectedCategory === category.value ? 'bg-gold/10 text-gold' : ''}`}
                      onClick={() => onCategorySelect(category.value)}
                    >
                      {category.name}
                    </Button>
                  </div>
                ))}
              </div>
              {/* Subcategories */}
              {selectedCategory && subcategories.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <h3 className="font-medium mb-2">Subcategorias</h3>
                    {subcategories.map((subcategory: SubcategoryType) => (
                      <div key={subcategory.id}>
                        {subcategories.length > 1 && (
                          <span className="block text-xs text-muted-foreground font-medium ml-2 mb-1">{subcategory.name}</span>
                        )}
                        <div className="flex flex-col space-y-1">
                          {subcategory.attributes.map(attr => (
                            <Button
                              key={`${subcategory.id}-${attr.id}`}
                              variant="ghost"
                              className={`justify-start font-normal h-8 px-2 w-full text-left ${
                                selectedSubcategories.includes(attr.id) ? 'bg-gold/10 text-gold' : ''
                              }`}
                              onClick={() => onSubcategoryToggle(attr.id)}
                            >
                              {attr.name}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </ScrollArea>
          </div>
        </SidebarContent>
        <SidebarFooter className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border md:hidden">
          <Button className="w-full bg-gold hover:bg-gold-light text-white" onClick={() => setIsMobileFiltersOpen(false)}>
            Aplicar Filtros
          </Button>
        </SidebarFooter>
      </aside>
      {isMobileFiltersOpen && <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setIsMobileFiltersOpen(false)} />}
    </>
  );
};

export default FilterSidebar;
