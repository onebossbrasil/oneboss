import { supabase } from "@/integrations/supabase/client";
import { logServiceAction } from "./baseService";

// Add an attribute to a subcategory
export const addSubcategoryValue = async (subcategoryId: number | string, attribute: string, categoryId: number | string) => {
  try {
    logServiceAction("Adicionando atributo à subcategoria", { subcategoryId, attribute, categoryId });

    const { error } = await supabase
      .from('attributes')
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
export const removeSubcategoryValue = async (categoryId: number | string, subcategoryId: number | string, attributeId: string) => {
  try {
    logServiceAction("Removendo atributo da subcategoria", { subcategoryId, attributeId });

    // Busca e deleta pelo id (direto!), não pelo nome
    const { error } = await supabase
      .from('attributes')
      .delete()
      .eq('id', attributeId);

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

export const updateSubcategoryValue = async (
  subcategoryId: string,
  attributeId: string, // <--- ID, não mais o name antigo
  newAttribute: string
) => {
  try {
    logServiceAction("Atualizando atributo da subcategoria", { subcategoryId, attributeId, newAttribute });
    // Atualizar atributo diretamente pelo id
    const { error } = await supabase
      .from('attributes')
      .update({ attribute: newAttribute })
      .eq('id', attributeId);

    if (error) {
      console.error("Erro ao atualizar atributo:", error);
      throw error;
    }
    logServiceAction("Atributo da subcategoria atualizado com sucesso");
  } catch (err) {
    console.error("Exceção ao atualizar atributo da subcategoria:", err);
    throw err;
  }
};
