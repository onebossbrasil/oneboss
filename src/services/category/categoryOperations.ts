
import { supabase } from "@/integrations/supabase/client";

// Função para buscar todos os dados de categorias, subcategorias e atributos
export const fetchCategoriesData = async () => {
  // Busca categorias
  const { data: categoriesData, error: categoriesError } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (categoriesError) throw categoriesError;

  // Busca subcategorias
  const { data: subcategoriesData, error: subcategoriesError } = await supabase
    .from('subcategories')
    .select('*')
    .order('name');

  if (subcategoriesError) throw subcategoriesError;

  // Busca atributos - CORRIGIDO: 'attributes' é a tabela correta!
  const { data: valuesData, error: valuesError } = await supabase
    .from('attributes') // Corrige: era 'subcategory_attributes'
    .select('*')
    .order('attribute');

  if (valuesError) throw valuesError;

  // Retorna dados brutos para processamento
  return {
    categoriesData,
    subcategoriesData,
    valuesData,
  };
};
