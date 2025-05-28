
import { useState, useMemo } from "react";
import { X, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { useCategories } from "@/contexts/CategoryContext";
import { SubcategoryType, AttributeType } from "@/types/category";
import { Product } from "@/types/product";
import AttributeListDisplay from "@/components/categories/AttributeListDisplay";

// Estilos inspirados no sidebar admin
const highlightCls = "bg-gold/90 text-gray-900 font-bold shadow";
const hoverCls = "hover:bg-gold/10 text-gold";
const normalCatCls = "text-gray-800";
const subcatDivider = "border-l-[3px] border-gold/30 pl-2 ml-3";

type FilterSidebarProps = {
  selectedCategory: string | null;
  selectedSubcategories: AttributeType[];
  onCategorySelect: (categoryId: string) => void;
  onSubcategoryToggle: (attr: AttributeType) => void;
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

  // Estado: subcategoria expandida
  const [expandedSubcatId, setExpandedSubcatId] = useState<string | null>(null);

  // Só mostra subcategorias com atributos ativos
  const visibleSubcategories = useMemo(() => {
    if (!selectedCategory) return [];
    const cat = categories.find((cat) => cat.value === selectedCategory);
    if (!cat) return [];
    return (cat.subcategories || [])
      .map((subcat) => {
        const activeAttrs = subcat.attributes.filter((attr) =>
          publishedProducts.some(
            (prod) =>
              String(prod.categoryId) === String(selectedCategory) &&
              String(prod.attributeId) === String(attr.id)
          )
        );
        return activeAttrs.length
          ? { ...subcat, attributes: activeAttrs }
          : null;
      })
      .filter(Boolean) as SubcategoryType[];
  }, [categories, selectedCategory, publishedProducts]);

  // Handler para expand/collapse a subcategoria selecionada
  const handleSubcatExpand = (subcatId: string) => {
    setExpandedSubcatId((prev) => (prev === subcatId ? null : subcatId));
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
            {categories.map((category) => (
              <div key={category.id}>
                <Button
                  variant="ghost"
                  className={`justify-start font-medium h-9 w-full text-left rounded-md transition-all
                    px-2 ${selectedCategory === category.value ? highlightCls : normalCatCls} ${hoverCls}`}
                  onClick={() => {
                    // Se já está selecionada, desmarca
                    if (selectedCategory === category.value) {
                      onCategorySelect("");
                      setExpandedSubcatId(null);
                    } else {
                      onCategorySelect(category.value);
                      setExpandedSubcatId(null);
                    }
                  }}
                >
                  {/* REMOVIDO o <Circle /> */}
                  {category.name}
                  <span className="ml-auto">
                    {selectedCategory === category.value ? (
                      <ChevronDown size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                  </span>
                </Button>
                {/* Exibir subcategorias somente da selecionada */}
                {selectedCategory === category.value && visibleSubcategories.length > 0 && (
                  <div className="mt-1 mb-2">
                    {visibleSubcategories.map((subcategory) => (
                      <div key={subcategory.id} className="ml-3">
                        <Button
                          variant="ghost"
                          className={`justify-start h-8 w-full text-sm rounded-md px-3 text-left transition-all
                            ${expandedSubcatId === subcategory.id ? "bg-gold/15 text-gold font-semibold" : "text-gray-700"} ${hoverCls}`}
                          onClick={() => handleSubcatExpand(subcategory.id)}
                        >
                          {subcategory.name}
                          <span className="ml-auto">
                            {expandedSubcatId === subcategory.id ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronRight size={16} />
                            )}
                          </span>
                        </Button>
                        {/* Exibir atributos (valores) só da subcategoria expandida */}
                        {expandedSubcatId === subcategory.id && subcategory.attributes.length > 0 && (
                          <div className={`${subcatDivider} py-1`}>
                            <AttributeListDisplay
                              attributes={subcategory.attributes}
                              selectedAttributes={selectedSubcategories}
                              onAttributeToggle={onSubcategoryToggle}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
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
