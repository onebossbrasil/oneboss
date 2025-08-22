import { CategoryType, SubcategoryType } from "@/types/category";

// Group subcategories by category ID
export const groupSubcategoriesByCategory = (subcategoriesData: any[]) => {
  const subcategoriesByCategory: Record<string, any[]> = {};
  
  console.log("[categoryUtils] ===== AGRUPANDO SUBCATEGORIAS =====");
  console.log("[categoryUtils] Raw subcategoriesData:", subcategoriesData);
  
  subcategoriesData.forEach((subcategory: any) => {
    if (!subcategoriesByCategory[subcategory.category_id]) {
      subcategoriesByCategory[subcategory.category_id] = [];
    }
    subcategoriesByCategory[subcategory.category_id].push(subcategory);
    
    // Log específico para categoria IMÓVEIS
    if (subcategory.name === "Residencial" || subcategory.name === "Comercial" || subcategory.name === "Rural") {
      console.log("[categoryUtils] 🏠 Subcategoria IMÓVEIS encontrada:", {
        id: subcategory.id,
        name: subcategory.name,
        category_id: subcategory.category_id,
        type: subcategory.type
      });
    }
  });
  
  console.log("[categoryUtils] Resultado agrupamento subcategorias:", subcategoriesByCategory);
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
  console.log("[categoryUtils] ===== FORMATANDO DADOS DE CATEGORIAS =====");
  console.log("[categoryUtils] categoriesData:", categoriesData);
  console.log("[categoryUtils] subcategoriesByCategory:", subcategoriesByCategory);
  
  const formattedCategories = categoriesData.map((category: any) => {
    const categorySubcategories = subcategoriesByCategory[category.id] || [];
    
    // Debug específico para categoria IMÓVEIS
    if (category.name === "Imóveis") {
      console.log("[categoryUtils] 🏠 ===== PROCESSANDO CATEGORIA IMÓVEIS =====");
      console.log("[categoryUtils] Categoria IMÓVEIS raw:", category);
      console.log("[categoryUtils] Subcategorias para IMÓVEIS:", categorySubcategories);
      console.log("[categoryUtils] Quantidade de subcategorias:", categorySubcategories.length);
    }
    
    const formattedCategory = {
      id: category.id.toString(),
      name: category.name,
      value: category.value,
      subcategories: categorySubcategories.map((subcategory: any) => {
        const formattedSubcategory = {
          id: subcategory.id.toString(),
          name: subcategory.name,
          type: subcategory.type,
          attributes: attributesBySubcategory[subcategory.id] || []
        };
        
        // Debug específico para subcategorias de IMÓVEIS
        if (category.name === "Imóveis") {
          console.log("[categoryUtils] 🏠 Subcategoria IMÓVEIS formatada:", formattedSubcategory);
        }
        
        return formattedSubcategory;
      })
    };
    
    // Debug final para categoria IMÓVEIS
    if (category.name === "Imóveis") {
      console.log("[categoryUtils] 🏠 CATEGORIA IMÓVEIS FINAL:", formattedCategory);
    }
    
    return formattedCategory;
  });
  
  console.log("[categoryUtils] ===== RESULTADO FINAL =====");
  console.log("[categoryUtils] Todas as categorias formatadas:", formattedCategories);
  
  return formattedCategories;
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
