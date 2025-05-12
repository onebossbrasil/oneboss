
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

const CategorySelector = ({
  selectedCategory,
  subcategoryValues,
  onCategoryChange,
  onSubcategoryChange
}: CategorySelectorProps) => {
  const { categories } = useCategories();
  
  // Get all subcategory types for the selected category
  const subcategoryTypes = () => {
    const category = categories.find(cat => cat.value === selectedCategory);
    return category ? category.subcategories.map(sc => ({ 
      type: sc.type,
      name: sc.name 
    })) : [];
  };
  
  // Get available values for a specific subcategory type
  const getSubcategoryOptions = (subcatType: string) => {
    const category = categories.find(cat => cat.value === selectedCategory);
    if (!category) return [];
    
    const subcategory = category.subcategories.find(sc => sc.type === subcatType);
    return subcategory ? subcategory.values : [];
  };

  // Handle subcategory selection
  const handleSubcategorySelect = (type: string, value: string) => {
    onSubcategoryChange(type, value);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="category">Categoria</Label>
        <Select onValueChange={onCategoryChange} value={selectedCategory}>
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
      
      {selectedCategory && subcategoryTypes().length > 0 && (
        <div className="space-y-4">
          {subcategoryTypes().map((subcategory) => (
            <div key={subcategory.type}>
              <Label htmlFor={`subcategory-${subcategory.type}`}>{subcategory.name}</Label>
              <Select 
                onValueChange={(value) => handleSubcategorySelect(subcategory.type, value)}
                value={subcategoryValues[subcategory.type] || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Selecione ${subcategory.name.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {getSubcategoryOptions(subcategory.type).map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
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

export default CategorySelector;
