import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { useCategories } from "@/contexts/CategoryContext";
import { SubcategoryType } from "@/types/category";
type FilterSidebarProps = {
  selectedCategory: string | null;
  selectedSubcategories: string[];
  onCategorySelect: (categoryId: string) => void;
  onSubcategoryToggle: (subcategory: string) => void;
  isMobileFiltersOpen: boolean;
  setIsMobileFiltersOpen: (isOpen: boolean) => void;
  resetFilters: () => void;
};
const FilterSidebar = ({
  selectedCategory,
  selectedSubcategories,
  onCategorySelect,
  onSubcategoryToggle,
  isMobileFiltersOpen,
  setIsMobileFiltersOpen,
  resetFilters
}: FilterSidebarProps) => {
  const {
    categories
  } = useCategories();
  const [openSubcategories, setOpenSubcategories] = useState<Record<string, boolean>>({});

  // Toggle a subcategory group open/closed state
  const toggleSubcategoryGroup = (subcategoryId: string) => {
    setOpenSubcategories(prev => ({
      ...prev,
      [subcategoryId]: !prev[subcategoryId]
    }));
  };

  // Helper function to get subcategories for selected category
  const getSubcategories = () => {
    if (!selectedCategory) return [];

    // Find the category by its value (since that's what we're using in URL/selection)
    const category = categories.find(cat => cat.value === selectedCategory);
    if (!category) return [];

    // Return the full subcategories array, not flattened
    return category.subcategories || [];
  };

  // Get subcategories for the selected category
  const subcategories = getSubcategories();
  const hasSubcategories = subcategories.length > 0;
  return <>
      <aside className={`fixed md:static inset-0 z-40 bg-background/95 md:bg-transparent backdrop-blur-md md:backdrop-blur-none md:w-64 flex-shrink-0 md:glassmorphism p-6 rounded-lg self-start md:sticky md:top-24 transition-all duration-300 transform ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} overflow-auto max-h-screen md:max-h-[calc(100vh-120px)] md:block`}>
        <SidebarHeader className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Filtros</h2>
            <Button variant="ghost" size="sm" className="md:hidden text-muted-foreground" onClick={() => setIsMobileFiltersOpen(false)}>
              <X size={18} />
            </Button>
          </div>
          
          {/* Clear Filters Button */}
          <Button variant="outline" size="sm" className="mt-4 text-xs w-full border-gold/40 text-gold hover:bg-gold/10 hover:text-gold" onClick={resetFilters}>
            Limpar Filtros
          </Button>
        </SidebarHeader>
        
        <SidebarContent>
          {/* Combined Filters Section with a single ScrollArea */}
          <div className="space-y-6">
            <h3 className="font-medium">Categorias</h3>
            
            <ScrollArea className="h-[400px] pr-4">
              {/* Categories section */}
              <div className="space-y-1 mb-6">
                {categories.map(category => <div key={category.id} className="flex flex-col">
                    <Button variant="ghost" className={`justify-start font-normal h-8 px-2 ${selectedCategory === category.value ? 'bg-gold/10 text-gold' : ''}`} onClick={() => onCategorySelect(category.value)}>
                      {category.name}
                    </Button>
                  </div>)}
              </div>
              
              {selectedCategory && <>
                  <Separator className="my-4" />
                  
                  {/* Subcategories section - using the same style as categories */}
                  <div className="space-y-6">
                    <h3 className="font-medium">Subcategorias</h3>
                    
                    {!hasSubcategories ? <p className="text-sm text-muted-foreground">Nenhuma subcategoria disponível para esta categoria</p> : <div className="space-y-1">
                        {subcategories.map((subcategory: SubcategoryType) => <div key={subcategory.id} className="mb-2">
                            <p className="text-sm font-medium mb-1 text-muted-foreground">{subcategory.name}</p>
                            {subcategory.values.map(value => <div key={`${subcategory.id}-${value}`} className="flex flex-col">
                                <Button variant="ghost" className={`justify-start font-normal h-8 px-2 ${selectedSubcategories.includes(value) ? 'bg-gold/10 text-gold' : ''}`} onClick={() => onSubcategoryToggle(value)}>
                                  {value}
                                </Button>
                              </div>)}
                          </div>)}
                      </div>}
                  </div>
                </>}
            </ScrollArea>
          </div>
        </SidebarContent>
        
        <SidebarFooter className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border md:hidden">
          <Button className="w-full bg-gold hover:bg-gold-light text-white" onClick={() => setIsMobileFiltersOpen(false)}>
            Aplicar Filtros
          </Button>
        </SidebarFooter>
      </aside>
      
      {/* Overlay for mobile filters */}
      {isMobileFiltersOpen && <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setIsMobileFiltersOpen(false)} />}
    </>;
};
export default FilterSidebar;