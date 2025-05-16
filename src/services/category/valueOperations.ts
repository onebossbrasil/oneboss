
import { supabase } from "@/integrations/supabase/client";
import { logServiceAction } from "./baseService";

// Add an attribute to a subcategory
export const addSubcategoryValue = async (subcategoryId: number | string, attribute: string, categoryId: number | string) => {
  try {
    logServiceAction("Adicionando atributo à subcategoria", { subcategoryId, attribute, categoryId });

    const { error } = await supabase
      .from('subcategory_attributes')
      .insert({
        subcategory_id: subcategoryId.toString(),
        attribute
      });

    if (error) {
      console.error("Erro ao adicionar atributo à subcategoria:", error);
      throw error;
    }

    logServiceAction("Atributo adicionado com sucesso à subcategoria");
  } catch (err) {
    console.error("Exceção ao adicionar atributo à subcategoria:", err);
    throw err;
  }
};

// Remove an attribute from a subcategory
export const removeSubcategoryValue = async (subcategoryId: number | string, attribute: string, categoryId: number | string) => {
  try {
    logServiceAction("Removendo atributo da subcategoria", { subcategoryId, attribute });

    // Find the attribute first
    const { data: attributeData, error: findError } = await supabase
      .from('subcategory_attributes')
      .select('id')
      .eq('subcategory_id', subcategoryId.toString())
      .eq('attribute', attribute)
      .single();

    if (findError) {
      console.error("Erro ao buscar atributo da subcategoria:", findError);
      throw findError;
    }

    if (!attributeData) {
      console.error("Atributo não encontrado");
      throw new Error('Atributo não encontrado');
    }

    logServiceAction("Atributo encontrado, ID:", attributeData.id);

    // Delete the attribute
    const { error } = await supabase
      .from('subcategory_attributes')
      .delete()
      .eq('id', attributeData.id);

    if (error) {
      console.error("Erro ao deletar atributo da subcategoria:", error);
      throw error;
    }

    logServiceAction("Atributo removido com sucesso da subcategoria");
  } catch (err) {
    console.error("Exceção ao remover atributo da subcategoria:", err);
    throw err;
  }
};
