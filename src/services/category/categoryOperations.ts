
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
export const deleteCategory = async (categoryId: number) => {
  try {
    logServiceAction("Deletando categoria", categoryId);
    
    // Primeiro, vamos remover todas as subcategorias associadas
    // Isso também removerá automaticamente os valores das subcategorias devido às restrições de chave estrangeira
    const { error: subError } = await supabase
      .from('subcategories')
      .delete()
      .eq('category_id', categoryId.toString());
      
    if (subError) {
      console.error("Erro ao deletar subcategorias:", subError);
      throw subError;
    }
    
    // Agora deletamos a categoria
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId.toString());
      
    if (error) {
      console.error("Erro ao deletar categoria:", error);
      throw error;
    }
    
    logServiceAction("Categoria deletada com sucesso");
    
    // Atualizamos qualquer produto que referencia esta categoria para não ter categoria
    const { error: prodError } = await supabase
      .from('products')
      .update({ category_id: null })
      .eq('category_id', categoryId.toString());
    
    if (prodError) {
      console.error("Erro ao atualizar produtos:", prodError);
      // Não lançamos erro aqui pois a categoria já foi deletada com sucesso
    }
  } catch (err) {
    console.error("Exceção ao deletar categoria:", err);
    throw err;
  }
};
