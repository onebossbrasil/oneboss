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
  selectedSubcategoryId, // valor prioritário, o UUID da subcategoria escolhida
  onCategoryChange,
  onSubcategoryChange,
  onSubcategoryIdChange,
  onAttributeIdChange
}: CategorySelectorProps) => {
  const { categories, isLoading, error } = useCategories();

  // O valor selecionado é SEMPRE o id (uuid) da subcategoria
  const category = categories.find(cat => cat.id === selectedCategory);
  const [activeSubcategoryId, setActiveSubcategoryId] = useState<string | null>(selectedSubcategoryId ?? null);

  // Sincronizar com prop corretamente pelos UUIDs sempre!
  useEffect(() => {
    setActiveSubcategoryId(selectedSubcategoryId ?? null);
  }, [selectedSubcategoryId]);

  // Busca subcategoria ativa pelo id
  const activeSubcatObj = category?.subcategories.find(
    sc => sc.id === activeSubcategoryId
  );

  // Notifica mudança por ID
  useEffect(() => {
    if (onSubcategoryIdChange) {
      onSubcategoryIdChange(activeSubcategoryId);
    }
    // eslint-disable-next-line
  }, [activeSubcategoryId]);

  // Notifica alteração dos atributos via prop sempre por UUID
  useEffect(() => {
    if (onAttributeIdChange && activeSubcatObj && subcategoryValues[activeSubcategoryId || ""]) {
      const attributeSelected = subcategoryValues[activeSubcategoryId || ""];
      if (attributeSelected) onAttributeIdChange(attributeSelected);
      else onAttributeIdChange(null);
    } else if (onAttributeIdChange && !subcategoryValues[activeSubcategoryId || ""]) {
      onAttributeIdChange(null);
    }
    // eslint-disable-next-line
  }, [subcategoryValues, activeSubcatObj, activeSubcategoryId, onAttributeIdChange]);

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
            setActiveSubcategoryId(null);
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
          <Label htmlFor="subcategoryId">Subcategoria</Label>
          <Select 
            onValueChange={(subcatId) => {
              setActiveSubcategoryId(subcatId);
              if (onSubcategoryIdChange) onSubcategoryIdChange(subcatId);
              if (onAttributeIdChange) onAttributeIdChange(null);
            }}
            value={activeSubcategoryId ?? ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma subcategoria" />
            </SelectTrigger>
            <SelectContent>
              {category
                ? category.subcategories.map(sc => (
                  <SelectItem key={sc.id} value={sc.id}>
                    {sc.name}
                  </SelectItem>
                ))
                : null}
            </SelectContent>
          </Select>
        </div>
      )}

      {activeSubcategoryId && activeSubcatObj && (
        <div>
          <Label htmlFor="subcategoryValue">
            {activeSubcatObj.name + " - Atributos"}
          </Label>
          <Select 
            onValueChange={(attributeId) => {
              onSubcategoryChange(activeSubcategoryId, attributeId);
              if (onAttributeIdChange) {
                onAttributeIdChange(attributeId);
              }
            }}
            value={subcategoryValues[activeSubcategoryId] || ""}
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
