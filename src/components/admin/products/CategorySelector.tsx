import { useCategories } from "@/contexts/CategoryContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { CategoryProvider } from "@/contexts/CategoryContext";

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
  
  // Reset active subcategory type when category changes
  useEffect(() => {
    setActiveSubcategoryType(null);
  }, [selectedCategory]);
  
  // Get all subcategory types for the selected category
  const subcategoryTypes = () => {
    const category = categories.find(cat => cat.value === selectedCategory);
    return category ? category.subcategories.map(sc => sc.type) : [];
  };
  
  // Get available values for a specific subcategory type
  const getSubcategoryOptions = (subcatType: string) => {
    const category = categories.find(cat => cat.value === selectedCategory);
    if (!category) return [];
    
    const subcategory = category.subcategories.find(sc => sc.type === subcatType);
    return subcategory ? subcategory.values : [];
  };
  
  // Get the label of a subcategory type
  const getSubcategoryLabel = (subcatType: string) => {
    const category = categories.find(cat => cat.value === selectedCategory);
    if (!category) return subcatType.charAt(0).toUpperCase() + subcatType.slice(1);
    
    const subcategory = category.subcategories.find(sc => sc.type === subcatType);
    return subcategory ? subcategory.name : subcatType.charAt(0).toUpperCase() + subcatType.slice(1);
  };
  
  // Handle subcategory selection
  const handleSubcategoryTypeSelect = (type: string) => {
    setActiveSubcategoryType(type);
  };

  // If categories are loading, show a placeholder
  if (isLoading) {
    return <div className="space-y-4">Carregando categorias...</div>;
  }
  
  // If there's an error fetching categories, show an error message
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
              <SelectItem key={category.value} value={category.value}>
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
              {(() => {
                const category = categories.find(cat => cat.value === selectedCategory);
                return category ? category.subcategories.map(sc => (
                  <SelectItem key={sc.type} value={sc.type}>
                    {sc.name}
                  </SelectItem>
                )) : null;
              })()}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {activeSubcategoryType && (
        <div>
          <Label htmlFor="subcategoryValue">
            {(() => {
              const category = categories.find(cat => cat.value === selectedCategory);
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
                  const category = categories.find(cat => cat.value === selectedCategory);
                  const subcategory = category?.subcategories.find(sc => sc.type === activeSubcategoryType);
                  const nomeSubcategoria = subcategory ? subcategory.name.toLowerCase() : activeSubcategoryType.toLowerCase();
                  return `Selecione um atributo para ${nomeSubcategoria}`;
                })()
              } />
            </SelectTrigger>
            <SelectContent>
              {(() => {
                const category = categories.find(cat => cat.value === selectedCategory);
                const subcategory = category?.subcategories.find(sc => sc.type === activeSubcategoryType);
                return subcategory ? subcategory.values.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                )) : null;
              })()}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label htmlFor="featured">Em Destaque?</Label>
        <Select 
          value={subcategoryValues['featured'] || "false"} 
          onValueChange={(value) => onSubcategoryChange('featured', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="O produto ficará em destaque?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Sim</SelectItem>
            <SelectItem value="false">Não</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

// Remover o provider wrapper;
// Agora exporta simplesmente o conteúdo.
const CategorySelector = (props: CategorySelectorProps) => {
  return <CategorySelectorContent {...props} />;
};

export default CategorySelector;
