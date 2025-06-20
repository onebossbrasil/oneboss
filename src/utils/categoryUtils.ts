
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

// Group attributes by subcategory ID - handle the 'attribute' field mapping
export const groupValuesBySubcategory = (attributesData: any[]) => {
  const attributesBySubcategory: Record<string, { id: string; name: string }[]> = {};

  console.log("[categoryUtils] Raw attributesData from DB:", attributesData);

  attributesData.forEach((row: any) => {
    if (!attributesBySubcategory[row.subcategory_id]) {
      attributesBySubcategory[row.subcategory_id] = [];
    }
    
    // Map database 'attribute' field to frontend 'name' field
    const attributeObj = {
      id: row.id.toString(),
      name: row.attribute // 'attribute' from database becomes 'name' in frontend
    };
    
    console.log("[categoryUtils] Mapping attribute:", {
      rawRow: row,
      mapped: attributeObj
    });
    
    attributesBySubcategory[row.subcategory_id].push(attributeObj);
  });

  console.log("[categoryUtils] Final attributesBySubcategory:", attributesBySubcategory);
  return attributesBySubcategory;
};

// Format categories data into the expected structure
export const formatCategoriesData = (
  categoriesData: any[],
  subcategoriesByCategory: Record<string, any[]>,
  attributesBySubcategory: Record<string, { id: string; name: string }[]>
): CategoryType[] => {
  return categoriesData.map((category: any) => {
    const categorySubcategories = subcategoriesByCategory[category.id] || [];
    return {
      id: category.id.toString(),
      name: category.name,
      value: category.value,
      subcategories: categorySubcategories.map((subcategory: any) => ({
        id: subcategory.id.toString(),
        name: subcategory.name,
        type: subcategory.type,
        attributes: attributesBySubcategory[subcategory.id] || []
      }))
    };
  });
};

// Find category by ID
export const findCategoryById = (categories: CategoryType[], categoryId: string): CategoryType | undefined => {
  return categories.find(cat => cat.id === categoryId);
};

// Find subcategory by ID
export const findSubcategoryById = (
  categories: CategoryType[], 
  categoryId: string, 
  subcategoryId: string
): SubcategoryType | undefined => {
  const category = findCategoryById(categories, categoryId);
  return category?.subcategories.find(sub => sub.id === subcategoryId);
};
