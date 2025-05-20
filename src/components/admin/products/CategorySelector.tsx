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

  // Adicional: buscar subcategoria ativa como objeto, não só type
  const activeSubcatObj = category?.subcategories.find(
    sc => sc.type === activeSubcategoryType
  );

  // Atualizar subcategoriaId ao selecionar subcategoria
  useEffect(() => {
    if (onSubcategoryIdChange) {
      onSubcategoryIdChange(activeSubcatObj?.id || null);
    }
    // eslint-disable-next-line
  }, [activeSubcatObj?.id]);

  // Atualizar atributoId ao selecionar atributo
  useEffect(() => {
    if (onAttributeIdChange && activeSubcatObj && subcategoryValues[activeSubcategoryType || ""]) {
      // Encontrar o atributoId correspondente ao atributo selecionado
      const attributeSelected = subcategoryValues[activeSubcategoryType];
      // Procurar ID do atributo a partir do nome/valor
      const attributeObj = activeSubcatObj?.attributesData?.find(
        (a: any) => a.attribute === attributeSelected
      );
      if (attributeObj) onAttributeIdChange(attributeObj.id);
      else onAttributeIdChange(null);
    } else if (onAttributeIdChange && !subcategoryValues[activeSubcategoryType || ""]) {
      onAttributeIdChange(null);
    }
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
          onValueChange={onCategoryChange} 
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
            onValueChange={(type) => setActiveSubcategoryType(type)}
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
            }}
            value={subcategoryValues[activeSubcategoryType] || ""}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                `Selecione um atributo para ${activeSubcatObj.name.toLowerCase()}`
              } />
            </SelectTrigger>
            <SelectContent>
              {activeSubcatObj.attributesData
                ? activeSubcatObj.attributesData.map((option: any) => (
                    <SelectItem key={option.id} value={option.attribute}>
                      {option.attribute}
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
