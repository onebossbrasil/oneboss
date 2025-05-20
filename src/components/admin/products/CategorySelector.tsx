
import { useCategories } from "@/contexts/CategoryContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

type CategorySelectorProps = {
  selectedCategory: string;
  subcategoryValues: Record<string, string>;
  onCategoryChange: (value: string) => void;
  onSubcategoryChange: (type: string, value: string) => void;
};

const CategorySelectorContent = ({
  selectedCategory,
  subcategoryValues,
  onCategoryChange,
  onSubcategoryChange
}: CategorySelectorProps) => {
  const { categories, isLoading, error } = useCategories();
  const [activeSubcategoryType, setActiveSubcategoryType] = useState<string | null>(null);
  
  useEffect(() => {
    setActiveSubcategoryType(null);
  }, [selectedCategory]);
  
  const category = categories.find(cat => cat.id === selectedCategory);

  // Get all subcategory types for the selected category
  const subcategoryTypes = () => {
    return category ? category.subcategories.map(sc => sc.type) : [];
  };
  
  // Get available attributes for a specific subcategory type
  const getSubcategoryOptions = (subcatType: string) => {
    const subcategory = category?.subcategories.find(sc => sc.type === subcatType);
    return subcategory ? subcategory.attributes : [];
  };
  
  // Get the label of a subcategory type
  const getSubcategoryLabel = (subcatType: string) => {
    const subcategory = category?.subcategories.find(sc => sc.type === subcatType);
    return subcategory ? subcategory.name : subcatType.charAt(0).toUpperCase() + subcatType.slice(1);
  };
  
  // Handle subcategory selection
  const handleSubcategoryTypeSelect = (type: string) => {
    setActiveSubcategoryType(type);
  };

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
            onValueChange={setActiveSubcategoryType} 
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
      
      {activeSubcategoryType && (
        <div>
          <Label htmlFor="subcategoryValue">
            {(() => {
              const subcategory = category?.subcategories.find(sc => sc.type === activeSubcategoryType);
              return (subcategory ? subcategory.name : activeSubcategoryType) + " - Atributos";
            })()}
          </Label>
          <Select 
            onValueChange={(value) => onSubcategoryChange(activeSubcategoryType, value)}
            value={subcategoryValues[activeSubcategoryType] || ""}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                (() => {
                  const subcategory = category?.subcategories.find(sc => sc.type === activeSubcategoryType);
                  const nomeSubcategoria = subcategory ? subcategory.name.toLowerCase() : activeSubcategoryType.toLowerCase();
                  return `Selecione um atributo para ${nomeSubcategoria}`;
                })()
              } />
            </SelectTrigger>
            <SelectContent>
              {(() => {
                const subcategory = category?.subcategories.find(sc => sc.type === activeSubcategoryType);
                return subcategory ? subcategory.attributes.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                )) : null;
              })()}
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
