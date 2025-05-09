
import { CategoryType, SubcategoryType } from "@/types/category";

// Group subcategories by category ID
export const groupSubcategoriesByCategory = (subcategoriesData: any[]) => {
  const subcategoriesByCategory: Record<string, any[]> = {};
  
  subcategoriesData.forEach((subcategory: any) => {
    if (!subcategoriesByCategory[subcategory.category_id]) {
      subcategoriesByCategory[subcategory.category_id] = [];
    }
    subcategoriesByCategory[subcategory.category_id].push(subcategory);
  });
  
  return subcategoriesByCategory;
};

// Group values by subcategory ID
export const groupValuesBySubcategory = (valuesData: any[]) => {
  const valuesBySubcategory: Record<string, string[]> = {};
  
  valuesData.forEach((value: any) => {
    if (!valuesBySubcategory[value.subcategory_id]) {
      valuesBySubcategory[value.subcategory_id] = [];
    }
    valuesBySubcategory[value.subcategory_id].push(value.value);
  });
  
  return valuesBySubcategory;
};

// Format categories data into the expected structure
export const formatCategoriesData = (
  categoriesData: any[], 
  subcategoriesByCategory: Record<string, any[]>,
  valuesBySubcategory: Record<string, string[]>
): CategoryType[] => {
  return categoriesData.map((category: any) => {
    const categorySubcategories = subcategoriesByCategory[category.id] || [];
    
    return {
      id: parseInt(category.id.toString(), 10),
      name: category.name,
      value: category.value,
      subcategories: categorySubcategories.map((subcategory: any) => ({
        id: parseInt(subcategory.id.toString(), 10),
        name: subcategory.name,
        type: subcategory.type,
        values: valuesBySubcategory[subcategory.id] || []
      }))
    };
  });
};

// Find category by ID
export const findCategoryById = (categories: CategoryType[], categoryId: number): CategoryType | undefined => {
  return categories.find(cat => cat.id === categoryId);
};

// Find subcategory by ID
export const findSubcategoryById = (
  categories: CategoryType[], 
  categoryId: number, 
  subcategoryId: number
): SubcategoryType | undefined => {
  const category = findCategoryById(categories, categoryId);
  return category?.subcategories.find(sub => sub.id === subcategoryId);
};
