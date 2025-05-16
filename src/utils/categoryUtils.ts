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

// Format categories data into the expected structure (IDs sempre string)
export const formatCategoriesData = (
  categoriesData: any[], 
  subcategoriesByCategory: Record<string, any[]>,
  valuesBySubcategory: Record<string, string[]>
): CategoryType[] => {
  return categoriesData.map((category: any) => {
    const categorySubcategories = subcategoriesByCategory[category.id] || [];
    return {
      id: category.id.toString(), // manter ID como string
      name: category.name,
      value: category.value,
      subcategories: categorySubcategories.map((subcategory: any) => ({
        id: subcategory.id.toString(), // manter ID como string
        name: subcategory.name,
        type: subcategory.type,
        values: valuesBySubcategory[subcategory.id] || []
      }))
    };
  });
};

// Find category by ID (id: string)
export const findCategoryById = (categories: CategoryType[], categoryId: string): CategoryType | undefined => {
  return categories.find(cat => cat.id === categoryId);
};

// Find subcategory by ID (ids sempre string)
export const findSubcategoryById = (
  categories: CategoryType[], 
  categoryId: string, 
  subcategoryId: string
): SubcategoryType | undefined => {
  const category = findCategoryById(categories, categoryId);
  return category?.subcategories.find(sub => sub.id === subcategoryId);
};
