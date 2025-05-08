
import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

type FilterSidebarProps = {
  categories: {
    id: string;
    name: string;
    subcategories: string[];
  }[];
  selectedCategory: string | null;
  selectedSubcategories: string[];
  onCategorySelect: (categoryId: string) => void;
  onSubcategoryToggle: (subcategory: string) => void;
  isMobileFiltersOpen: boolean;
  setIsMobileFiltersOpen: (isOpen: boolean) => void;
};

const FilterSidebar = ({
  categories,
  selectedCategory,
  selectedSubcategories,
  onCategorySelect,
  onSubcategoryToggle,
  isMobileFiltersOpen,
  setIsMobileFiltersOpen,
}: FilterSidebarProps) => {
  // Helper function to get subcategories for selected category
  const getSubcategories = () => {
    if (!selectedCategory) return [];
    const category = categories.find(cat => cat.id === selectedCategory);
    return category ? category.subcategories : [];
  };
  
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
            ✕
          </Button>
        </div>
        
        {/* Filtro por categoria */}
        <div className="space-y-4 mb-6">
          <h3 className="font-medium">Categorias</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex flex-col">
                <Button
                  variant="ghost"
                  className={`justify-start font-normal ${selectedCategory === category.id ? 'bg-gold/10 text-gold' : ''}`}
                  onClick={() => onCategorySelect(category.id)}
                >
                  {category.name}
                </Button>
              </div>
            ))}
          </div>
        </div>
        
        <Separator className="my-6" />
        
        {/* Filtro por subcategoria */}
        {selectedCategory && (
          <div className="space-y-4">
            <h3 className="font-medium">Subcategorias</h3>
            <div className="space-y-3">
              {getSubcategories().map((subcategory) => (
                <div key={subcategory} className="flex items-center space-x-2">
                  <Checkbox 
                    id={subcategory} 
                    checked={selectedSubcategories.includes(subcategory)}
                    onCheckedChange={() => onSubcategoryToggle(subcategory)}
                    className="border-gold/40 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                  />
                  <label 
                    htmlFor={subcategory}
                    className="text-sm cursor-pointer"
                  >
                    {subcategory}
                  </label>
                </div>
              ))}
            </div>
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
