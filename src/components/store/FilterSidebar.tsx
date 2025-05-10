
import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCategories } from "@/contexts/CategoryContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  resetFilters,
}: FilterSidebarProps) => {
  const { categories } = useCategories();
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
    return category.subcategories;
  };
  
  // Log for debugging
  console.log("Selected Category:", selectedCategory);
  console.log("Selected Subcategories:", selectedSubcategories);
  console.log("Available Categories:", categories.map(c => ({ id: c.id, value: c.value, name: c.name })));
  
  return (
    <>
      <aside 
        className={`fixed md:static inset-0 z-40 bg-background/95 md:bg-transparent backdrop-blur-md md:backdrop-blur-none md:w-64 flex-shrink-0 md:glassmorphism p-6 rounded-lg self-start md:sticky md:top-24 transition-all duration-300 transform ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} overflow-auto max-h-screen md:max-h-[calc(100vh-120px)] md:block`}
      >
        <div className="flex items-center justify-between mb-6">
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
        
        {/* Clear Filters Button */}
        <Button
          variant="outline"
          size="sm"
          className="mb-6 text-xs w-full border-gold/40 text-gold hover:bg-gold/10 hover:text-gold"
          onClick={resetFilters}
        >
          Limpar Filtros
        </Button>
        
        {/* Filtro por categoria */}
        <div className="space-y-4 mb-6">
          <h3 className="font-medium">Categorias</h3>
          <ScrollArea className="h-[200px] pr-4">
            <div className="space-y-1">
              {categories.map((category) => (
                <div key={category.id} className="flex flex-col">
                  <Button
                    variant="ghost"
                    className={`justify-start font-normal h-8 px-2 ${selectedCategory === category.value ? 'bg-gold/10 text-gold' : ''}`}
                    onClick={() => onCategorySelect(category.value)}
                  >
                    {category.name}
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        <Separator className="my-6" />
        
        {/* Filtro por subcategoria - usando o mesmo estilo das categorias */}
        {selectedCategory && (
          <div className="space-y-4">
            <h3 className="font-medium">Subcategorias</h3>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-1">
                {getSubcategories().map((subcategory: SubcategoryType) => (
                  <div key={subcategory.id} className="mb-2">
                    <p className="text-sm font-medium mb-1 text-muted-foreground">{subcategory.name}</p>
                    {subcategory.values.map((value) => (
                      <div key={`${subcategory.id}-${value}`} className="flex flex-col">
                        <Button
                          variant="ghost"
                          className={`justify-start font-normal h-8 px-2 ${selectedSubcategories.includes(value) ? 'bg-gold/10 text-gold' : ''}`}
                          onClick={() => onSubcategoryToggle(value)}
                        >
                          {value}
                        </Button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
        
        {/* Botão para aplicar filtros (apenas mobile) */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border md:hidden">
          <Button 
            className="w-full bg-gold hover:bg-gold-light text-white"
            onClick={() => setIsMobileFiltersOpen(false)}
          >
            Aplicar Filtros
          </Button>
        </div>
      </aside>
      
      {/* Overlay for mobile filters */}
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
