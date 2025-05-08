
import { useCategories } from "@/contexts/CategoryContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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

  // Get available subcategory types for the selected category
  const getSubcategoryTypes = () => {
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
      
      {selectedCategory && getSubcategoryTypes().map((subcatType) => (
        <div key={subcatType}>
          <Label htmlFor={subcatType}>{getSubcategoryLabel(subcatType)}</Label>
          <Select 
            onValueChange={(value) => onSubcategoryChange(subcatType, value)}
            value={subcategoryValues[subcatType] || ""}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Selecione ${getSubcategoryLabel(subcatType)}`} />
            </SelectTrigger>
            <SelectContent>
              {getSubcategoryOptions(subcatType).map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}

      <div>
        <Label htmlFor="featured">Em Destaque?</Label>
        <Select defaultValue="false">
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
