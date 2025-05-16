import { supabase } from "@/integrations/supabase/client";
import { logServiceAction } from "./baseService";

// Fetch all categories and their subcategories
export const fetchCategoriesData = async () => {
  try {
    logServiceAction("Buscando dados das categorias...");
    
    // Fetch categories
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (categoriesError) {
      console.error("Erro ao buscar categorias:", categoriesError);
      throw categoriesError;
    }

    // Fetch subcategories
    const { data: subcategoriesData, error: subcategoriesError } = await supabase
      .from('subcategories')
      .select('*')
      .order('name');

    if (subcategoriesError) {
      console.error("Erro ao buscar subcategorias:", subcategoriesError);
      throw subcategoriesError;
    }

    // Fetch subcategory values
    const { data: valuesData, error: valuesError } = await supabase
      .from('subcategory_values')
      .select('*');

    if (valuesError) {
      console.error("Erro ao buscar valores de subcategorias:", valuesError);
      throw valuesError;
    }

    logServiceAction("Dados carregados com sucesso", {
      categorias: categoriesData.length,
      subcategorias: subcategoriesData.length,
      valores: valuesData.length
    });

    return { categoriesData, subcategoriesData, valuesData };
  } catch (err) {
    console.error("Exceção ao buscar dados das categorias:", err);
    throw err;
  }
};

// Create a new category
export const createCategory = async (name: string, value: string) => {
  try {
    logServiceAction("Criando categoria", { name, value });
    
    const { data, error } = await supabase
      .from('categories')
      .insert({ name, value })
      .select()
      .single();
      
    if (error) {
      console.error("Erro ao criar categoria:", error);
      throw error;
    }
    
    logServiceAction("Categoria criada com sucesso", data);
    return data;
  } catch (err) {
    console.error("Exceção ao criar categoria:", err);
    throw err;
  }
};

// Delete a category
export const deleteCategory = async (categoryId: string) => {
  try {
    logServiceAction("Deletando categoria", categoryId);

    // Identify the category first to get its UUID format (optional, but ensures it exists)
    const { data: categoryData, error: findError } = await supabase
      .from('categories')
      .select('id')
      .eq('id', categoryId);
      
    if (findError) {
      console.error("Erro ao encontrar categoria:", findError);
      throw findError;
    }
    
    if (!categoryData || categoryData.length === 0) {
      throw new Error("Categoria não encontrada");
    }
    
    const categoryUuid = categoryData[0].id;
    
    // Update any products that reference this category
    logServiceAction("Atualizando produtos associados à categoria");
    
    const { error: prodError } = await supabase
      .from('products')
      .update({ category_id: null })
      .eq('category_id', categoryUuid);
    
    if (prodError) {
      console.error("Erro ao atualizar produtos:", prodError);
      throw prodError;
    }
    
    // Find subcategories to delete
    const { data: subcategoriesData, error: subFindError } = await supabase
      .from('subcategories')
      .select('id')
      .eq('category_id', categoryUuid);
      
    if (subFindError) {
      console.error("Erro ao buscar subcategorias:", subFindError);
      throw subFindError;
    }
    
    // Delete subcategory values first
    if (subcategoriesData && subcategoriesData.length > 0) {
      logServiceAction(`Removendo valores de ${subcategoriesData.length} subcategorias`);
      
      for (const subcat of subcategoriesData) {
        const { error: valuesError } = await supabase
          .from('subcategory_values')
          .delete()
          .eq('subcategory_id', subcat.id);
          
        if (valuesError) {
          console.error(`Erro ao deletar valores da subcategoria ${subcat.id}:`, valuesError);
          throw valuesError;
        }
      }
    }
    
    // Then delete subcategories
    if (subcategoriesData && subcategoriesData.length > 0) {
      logServiceAction("Removendo subcategorias");
      const { error: deleteSubError } = await supabase
        .from('subcategories')
        .delete()
        .eq('category_id', categoryUuid);
        
      if (deleteSubError) {
        console.error("Erro ao deletar subcategorias:", deleteSubError);
        throw deleteSubError;
      }
    }
    
    // Finally delete the category
    logServiceAction("Removendo a categoria");
    const { error: deleteCatError } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryUuid);
      
    if (deleteCatError) {
      console.error("Erro ao deletar categoria:", deleteCatError);
      throw deleteCatError;
    }
    
    logServiceAction("Categoria deletada com sucesso");
  } catch (err) {
    console.error("Exceção ao deletar categoria:", err);
    throw err;
  }
};
