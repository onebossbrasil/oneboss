
import { useCategories } from "@/contexts/CategoryContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

type CategorySelectorProps = {
  selectedCategory: string;
  subcategoryValues: Record<string, string>;
  onCategoryChange: (value: string) => void;
  onSubcategoryChange: (type: string, value: string) => void;
  onSubcategoryIdChange?: (subcategoryId: string | null) => void;
  onAttributeIdChange?: (attributeId: string | null) => void;
};

const CategorySelectorContent = ({
  selectedCategory,
  subcategoryValues,
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

  // Buscar objeto da subcategoria pela type
  const activeSubcatObj = category?.subcategories.find(
    sc => sc.type === activeSubcategoryType
  );

  // Atualizar subcategoriaId ao selecionar subcategoria
  useEffect(() => {
    if (onSubcategoryIdChange) {
      // Quando subcategoria mudar, envia o ID para o pai/hook
      onSubcategoryIdChange(activeSubcatObj?.id || null);
      console.log("[CategorySelector] Subcategoria selecionada:", activeSubcatObj?.id || null);
    }
    // eslint-disable-next-line
  }, [activeSubcatObj?.id]);

  // Atualizar atributoId ao selecionar atributo
  useEffect(() => {
    if (onAttributeIdChange && activeSubcatObj && subcategoryValues[activeSubcategoryType || ""]) {
      const attributeSelected = subcategoryValues[activeSubcategoryType];
      if (attributeSelected) onAttributeIdChange(attributeSelected);
      else onAttributeIdChange(null);
      console.log("[CategorySelector] Atributo selecionado:", attributeSelected);
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
            // Ao mudar categoria, limpa subcategoria
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
              // Também limpa atributo ao trocar subcategoria
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
            onValueChange={(value) => {
              onSubcategoryChange(activeSubcategoryType, value);
              // Ao escolher atributo, tenta enviar como ID para hook pai
              if (onAttributeIdChange) {
                onAttributeIdChange(value);
              }
              console.log("[CategorySelector] onSubcategoryChange:", activeSubcategoryType, value);
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
                ? activeSubcatObj.attributes.map((option: string) => (
                    <SelectItem key={option} value={option}>
                      {option}
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

