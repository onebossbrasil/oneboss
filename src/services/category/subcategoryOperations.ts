import { supabase } from "@/integrations/supabase/client";
import { logServiceAction } from "./baseService";

// Create a subcategory
export const createSubcategory = async (categoryId: number | string, name: string, type: string) => {
  try {
    logServiceAction("Criando subcategoria", { categoryId, name, type });
    
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
    
    logServiceAction("Subcategoria criada com sucesso", data);
    return data;
  } catch (err) {
    console.error("Exceção ao criar subcategoria:", err);
    throw err;
  }
};

// Delete a subcategory
export const deleteSubcategory = async (subcategoryId: number) => {
  try {
    logServiceAction("Deletando subcategoria", subcategoryId);
    
    // Primeiro, remover todos os atributos associados a esta subcategoria
    const { error: valuesError } = await supabase
      .from('attributes')
      .delete()
      .eq('subcategory_id', subcategoryId.toString());
      
    if (valuesError) {
      console.error("Erro ao deletar atributos da subcategoria:", valuesError);
      throw valuesError;
    }
    
    // Agora deletamos a subcategoria
    const { error } = await supabase
      .from('subcategories')
      .delete()
      .eq('id', subcategoryId.toString());
      
    if (error) {
      console.error("Erro ao deletar subcategoria:", error);
      throw error;
    }
    
    logServiceAction("Subcategoria deletada com sucesso");
  } catch (err) {
    console.error("Exceção ao deletar subcategoria:", err);
    throw err;
  }
};

// Update a subcategory
export const updateSubcategory = async (id: string, newName: string, newType: string) => {
  try {
    logServiceAction("Atualizando subcategoria", { id, newName, newType });
    const { error } = await supabase
      .from('subcategories')
      .update({ name: newName, type: newType })
      .eq('id', id);

    if (error) {
      console.error("Erro ao atualizar subcategoria:", error);
      throw error;
    }
    logServiceAction("Subcategoria atualizada com sucesso");
  } catch (err) {
    console.error("Exceção ao atualizar subcategoria:", err);
    throw err;
  }
};
