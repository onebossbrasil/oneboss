
import { supabase } from "@/integrations/supabase/client";
import { logServiceAction } from "./baseService";

// Add a value to a subcategory
export const addSubcategoryValue = async (subcategoryId: number | string, value: string, categoryId: number | string) => {
  try {
    logServiceAction("Adicionando valor à subcategoria", { subcategoryId, value, categoryId });
    
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
    
    logServiceAction("Valor adicionado com sucesso à subcategoria");
  } catch (err) {
    console.error("Exceção ao adicionar valor à subcategoria:", err);
    throw err;
  }
};

// Remove a value from a subcategory
export const removeSubcategoryValue = async (subcategoryId: number | string, value: string, categoryId: number | string) => {
  try {
    logServiceAction("Removendo valor da subcategoria", { subcategoryId, value });
    
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
    
    logServiceAction("Valor encontrado, ID:", valueData.id);
    
    // Delete the value
    const { error } = await supabase
      .from('subcategory_values')
      .delete()
      .eq('id', valueData.id);
      
    if (error) {
      console.error("Erro ao deletar valor da subcategoria:", error);
      throw error;
    }
    
    logServiceAction("Valor removido com sucesso da subcategoria");
  } catch (err) {
    console.error("Exceção ao remover valor da subcategoria:", err);
    throw err;
  }
};
