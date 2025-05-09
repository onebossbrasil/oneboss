
import { supabase } from "@/integrations/supabase/client";
import { CategoryType } from "@/types/category";

// Fetch all categories and their subcategories
export const fetchCategoriesData = async () => {
  try {
    console.log("Buscando dados das categorias...");
    
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

    console.log("Dados carregados com sucesso:", {
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
    console.log("Criando categoria:", { name, value });
    
    // Verificar a sessão do usuário atual
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error("Erro ao verificar sessão:", sessionError);
      throw new Error("Erro ao verificar autenticação. Por favor, faça login novamente.");
    }
    
    if (!sessionData.session) {
      console.error("Usuário não autenticado");
      throw new Error("Usuário não está autenticado. Por favor, faça login.");
    }
    
    console.log("Usuário autenticado:", sessionData.session.user.email);
    
    const { data, error } = await supabase
      .from('categories')
      .insert({ name, value })
      .select()
      .single();
      
    if (error) {
      console.error("Erro ao criar categoria:", error);
      throw error;
    }
    
    console.log("Categoria criada com sucesso:", data);
    return data;
  } catch (err) {
    console.error("Exceção ao criar categoria:", err);
    throw err;
  }
};

// Delete a category
export const deleteCategory = async (categoryId: number) => {
  try {
    console.log("Deletando categoria:", categoryId);
    
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId.toString());
      
    if (error) {
      console.error("Erro ao deletar categoria:", error);
      throw error;
    }
    
    console.log("Categoria deletada com sucesso");
  } catch (err) {
    console.error("Exceção ao deletar categoria:", err);
    throw err;
  }
};

// Create a subcategory
export const createSubcategory = async (categoryId: number, name: string, type: string) => {
  try {
    console.log("Criando subcategoria:", { categoryId, name, type });
    
    const { data, error } = await supabase
      .from('subcategories')
      .insert({ 
        category_id: categoryId.toString(),
        name,
        type
      })
      .select()
      .single();
      
    if (error) {
      console.error("Erro ao criar subcategoria:", error);
      throw error;
    }
    
    console.log("Subcategoria criada com sucesso:", data);
    return data;
  } catch (err) {
    console.error("Exceção ao criar subcategoria:", err);
    throw err;
  }
};

// Delete a subcategory
export const deleteSubcategory = async (subcategoryId: number) => {
  try {
    console.log("Deletando subcategoria:", subcategoryId);
    
    const { error } = await supabase
      .from('subcategories')
      .delete()
      .eq('id', subcategoryId.toString());
      
    if (error) {
      console.error("Erro ao deletar subcategoria:", error);
      throw error;
    }
    
    console.log("Subcategoria deletada com sucesso");
  } catch (err) {
    console.error("Exceção ao deletar subcategoria:", err);
    throw err;
  }
};

// Add a value to a subcategory
export const addSubcategoryValue = async (subcategoryId: number | string, value: string, categoryId: number | string) => {
  try {
    console.log("Adicionando valor à subcategoria:", { subcategoryId, value, categoryId });
    
    const { error } = await supabase
      .from('subcategory_values')
      .insert({ 
        subcategory_id: subcategoryId.toString(),
        value
      });
      
    if (error) {
      console.error("Erro ao adicionar valor à subcategoria:", error);
      throw error;
    }
    
    console.log("Valor adicionado com sucesso à subcategoria");
  } catch (err) {
    console.error("Exceção ao adicionar valor à subcategoria:", err);
    throw err;
  }
};

// Remove a value from a subcategory
export const removeSubcategoryValue = async (subcategoryId: number | string, value: string, categoryId: number | string) => {
  try {
    console.log("Removendo valor da subcategoria:", { subcategoryId, value });
    
    // Find the value first
    const { data: valueData, error: findError } = await supabase
      .from('subcategory_values')
      .select('id')
      .eq('subcategory_id', subcategoryId.toString())
      .eq('value', value)
      .single();
      
    if (findError) {
      console.error("Erro ao buscar valor da subcategoria:", findError);
      throw findError;
    }
    
    if (!valueData) {
      console.error("Valor não encontrado");
      throw new Error('Valor não encontrado');
    }
    
    console.log("Valor encontrado, ID:", valueData.id);
    
    // Delete the value
    const { error } = await supabase
      .from('subcategory_values')
      .delete()
      .eq('id', valueData.id);
      
    if (error) {
      console.error("Erro ao deletar valor da subcategoria:", error);
      throw error;
    }
    
    console.log("Valor removido com sucesso da subcategoria");
  } catch (err) {
    console.error("Exceção ao remover valor da subcategoria:", err);
    throw err;
  }
};
