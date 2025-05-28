
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

// CLASSES UNIFICADAS
const baseBtn =
  "w-full flex items-center justify-between text-left rounded-md transition-all px-2";
const activeCls = "bg-gold/90 text-gray-900 font-bold shadow";
const hoverCls = "hover:bg-gold/10 text-gold";
const normalCatCls = "text-gray-800";
const subcatDivider = "border-l-4 border-gold/60 pl-3 ml-3";
const activeAttrCls = "bg-gold/15 text-gold font-semibold";
const attrHoverCls = "hover:bg-gold/10 hover:text-gold";
const attrCls =
  "justify-start w-full text-left px-3 rounded-md transition-all h-8";

type FilterSidebarProps = {
  selectedCategory: string | null;
  selectedSubcategories: AttributeType[];
  onCategorySelect: (categoryId: string | null) => void;
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

  // Buscar a categoria selecionada pelo id (UUID)
  const currentCategory = selectedCategory
    ? categories.find((cat) => String(cat.id) === String(selectedCategory))
    : null;

  // Exibir todas as subcategorias da categoria selecionada
  const visibleSubcategories = useMemo(() => {
    if (!currentCategory) return [];
    return currentCategory.subcategories || [];
  }, [currentCategory]);

  // Handler para expand/collapse a subcategoria selecionada
  const handleSubcatExpand = (subcatId: string) => {
    setExpandedSubcatId((prev) => (prev === subcatId ? null : subcatId));
  };

  // Handler para toggle atributo: passa para cima
  const handleAttrToggle = (attr: AttributeType) => {
    onSubcategoryToggle(attr);
  };

  return (
    <>
      <aside
        className={`
          fixed md:static inset-0 z-40 bg-background/95 md:bg-[#F6F6F7] backdrop-blur-md 
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
                {/* Categoria */}
                <Button
                  variant="ghost"
                  className={`${baseBtn} h-9 text-base ${
                    selectedCategory === category.id
                      ? "bg-gold/90 text-white font-bold shadow"
                      : normalCatCls
                  } ${hoverCls}`}
                  onClick={() => {
                    if (selectedCategory === category.id) {
                      onCategorySelect(null);
                      setExpandedSubcatId(null);
                    } else {
                      onCategorySelect(category.id);
                      setExpandedSubcatId(null);
                    }
                  }}
                >
                  <span className="flex-1">{category.name}</span>
                  <span className={`ml-1 transition-colors ${
                    selectedCategory === category.id
                      ? "text-white"
                      : "text-gray-400 group-hover:text-gold"
                  }`}>
                    {selectedCategory === category.id ? (
                      <ChevronDown size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                  </span>
                </Button>
                {/* Subcategorias da categoria selecionada */}
                {selectedCategory === category.id && visibleSubcategories.length > 0 && (
                  <div className="mt-2 mb-2">
                    {visibleSubcategories.map((subcategory) => {
                      const hasAttributes = subcategory.attributes.length > 0;
                      const isExpanded = expandedSubcatId === subcategory.id;
                      return (
                        <div key={subcategory.id} className="ml-3">
                          {/* Subcategoria */}
                          <Button
                            variant="ghost"
                            className={`${baseBtn} h-8 text-sm ${
                              isExpanded
                                ? "bg-gold/90 text-white font-bold shadow"
                                : "text-gray-700"
                            } ${hoverCls} ${!hasAttributes ? "cursor-default opacity-60" : ""}`}
                            onClick={() => {
                              if (!hasAttributes) return;
                              handleSubcatExpand(subcategory.id);
                            }}
                            disabled={!hasAttributes}
                          >
                            <span className="flex-1">{subcategory.name}</span>
                            {/* Mostrar seta só se houver atributos */}
                            {hasAttributes && (
                              <span className={`ml-1 transition-colors ${
                                isExpanded ? "text-white" : "text-gray-400 group-hover:text-gold"
                              }`}>
                                {isExpanded ? (
                                  <ChevronDown size={16} />
                                ) : (
                                  <ChevronRight size={16} />
                                )}
                              </span>
                            )}
                          </Button>
                          {/* Atributos apenas da subcategoria expandida */}
                          {isExpanded && hasAttributes && (
                            <div className={`${subcatDivider} py-1`}>
                              <AttributeListDisplay
                                attributes={subcategory.attributes}
                                selectedAttributes={selectedSubcategories}
                                onAttributeToggle={handleAttrToggle}
                                unifedStyles={true}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
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
