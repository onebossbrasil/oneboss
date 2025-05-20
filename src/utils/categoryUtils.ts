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

// Group attributes by subcategory ID (agora usando tabela "attributes" corretamente)
export const groupValuesBySubcategory = (attributesData: any[]) => {
  const attributesBySubcategory: Record<string, { id: string; name: string }[]> = {};

  attributesData.forEach((row: any) => {
    // row vem de attributes (não mais subcategory_attributes)
    if (!attributesBySubcategory[row.subcategory_id]) {
      attributesBySubcategory[row.subcategory_id] = [];
    }
    // Garantir formato { id, name }
    attributesBySubcategory[row.subcategory_id].push({
      id: row.id ? row.id.toString() : row.attribute, // use id se houver, fallback para attribute string só para legado
      name: row.attribute
    });
  });

  return attributesBySubcategory;
};

// Format categories data into the expected structure (IDs sempre string)
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
