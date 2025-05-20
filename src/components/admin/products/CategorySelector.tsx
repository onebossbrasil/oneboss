
import { useCategories } from "@/contexts/CategoryContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

// Novo tipo: permite controlar valor inicial da subcategoria
type CategorySelectorProps = {
  selectedCategory: string;
  subcategoryValues: Record<string, string>;
  selectedSubcategoryId?: string | null; // NOVO!
  onCategoryChange: (value: string) => void;
  onSubcategoryChange: (type: string, value: string) => void;
  onSubcategoryIdChange?: (subcategoryId: string | null) => void;
  onAttributeIdChange?: (attributeId: string | null) => void;
};

const CategorySelectorContent = ({
  selectedCategory,
  subcategoryValues,
  selectedSubcategoryId, // novo
  onCategoryChange,
  onSubcategoryChange,
  onSubcategoryIdChange,
  onAttributeIdChange
}: CategorySelectorProps) => {
  const { categories, isLoading, error } = useCategories();
  const [activeSubcategoryType, setActiveSubcategoryType] = useState<string | null>(null);

  useEffect(() => {
    setActiveSubcategoryType(null);
  }, [selectedCategory]);

  const category = categories.find(cat => cat.id === selectedCategory);

  // Mapear subcategoryId recebido para subcategoryType
  useEffect(() => {
    if (selectedSubcategoryId && category) {
      const obj = category.subcategories.find(sc => sc.id === selectedSubcategoryId);
      if (obj) setActiveSubcategoryType(obj.type);
    }
    // eslint-disable-next-line
  }, [selectedSubcategoryId, category?.id]);

  // Buscar objeto da subcategoria pela type
  const activeSubcatObj = category?.subcategories.find(
    sc => sc.type === activeSubcategoryType
  );

  useEffect(() => {
    if (onSubcategoryIdChange) {
      onSubcategoryIdChange(activeSubcatObj?.id || null);
    }
    // eslint-disable-next-line
  }, [activeSubcatObj?.id]);

  useEffect(() => {
    if (onAttributeIdChange && activeSubcatObj && subcategoryValues[activeSubcategoryType || ""]) {
      const attributeSelected = subcategoryValues[activeSubcategoryType];
      if (attributeSelected) onAttributeIdChange(attributeSelected);
      else onAttributeIdChange(null);
    } else if (onAttributeIdChange && !subcategoryValues[activeSubcategoryType || ""]) {
      onAttributeIdChange(null);
    }
    // eslint-disable-next-line
  }, [subcategoryValues, activeSubcatObj, activeSubcategoryType, onAttributeIdChange]);

  if (isLoading) {
    return <div className="space-y-4">Carregando categorias...</div>;
  }

  if (error) {
    return <div className="text-red-500">Erro ao carregar categorias: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="category">Categoria</Label>
        <Select 
          onValueChange={(catId) => {
            onCategoryChange(catId);
            setActiveSubcategoryType(null);
          }}
          value={selectedCategory}
          disabled={categories.length === 0}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem 
                key={category.id} 
                value={category.id}
              >
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCategory && (
        <div>
          <Label htmlFor="subcategoryType">Subcategoria</Label>
          <Select 
            onValueChange={(type) => {
              setActiveSubcategoryType(type);
              // Ache o id da subcategoria ao selecionar (garante sincronia)
              const obj = category?.subcategories.find(sc => sc.type === type);
              if (onSubcategoryIdChange) {
                onSubcategoryIdChange(obj?.id || null);
              }
              if (onAttributeIdChange) {
                onAttributeIdChange(null);
              }
            }}
            value={activeSubcategoryType || ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma subcategoria" />
            </SelectTrigger>
            <SelectContent>
              {category
                ? category.subcategories.map(sc => (
                    <SelectItem key={sc.type} value={sc.type}>
                      {sc.name}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        </div>
      )}

      {activeSubcategoryType && activeSubcatObj && (
        <div>
          <Label htmlFor="subcategoryValue">
            {activeSubcatObj.name + " - Atributos"}
          </Label>
          <Select 
            onValueChange={(attributeId) => {
              onSubcategoryChange(activeSubcategoryType, attributeId);
              if (onAttributeIdChange) {
                onAttributeIdChange(attributeId);
              }
              console.log("[CategorySelector] onSubcategoryChange:", activeSubcategoryType, attributeId);
            }}
            value={subcategoryValues[activeSubcategoryType] || ""}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                `Selecione um atributo para ${activeSubcatObj.name.toLowerCase()}`
              } />
            </SelectTrigger>
            <SelectContent>
              {activeSubcatObj.attributes
                ? activeSubcatObj.attributes.map((attr: any) => (
                    <SelectItem key={attr.id} value={attr.id}>
                      {attr.name ?? attr}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

const CategorySelector = (props: CategorySelectorProps) => {
  return <CategorySelectorContent {...props} />;
};

export default CategorySelector;
