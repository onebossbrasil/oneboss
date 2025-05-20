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

/**
 * Cria uma nova categoria como admin usando função SQL.
 */
export const createCategory = async (name: string, value: string) => {
  // Obtém email do usuário autenticado
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user?.email) throw new Error('Usuário autenticado não possui email.');

  // Usa a função Postgres para inserir como admin
  const { data, error } = await supabase.rpc("admin_create_category", {
    _name: name,
    _value: value,
    _admin_email: user.email,
  });

  if (error) throw error;
  return data;
};

/**
 * Remove uma categoria pelo seu ID.
 */
export const deleteCategory = async (categoryId: string) => {
  const { error } = await supabase.from("categories").delete().eq("id", categoryId);
  if (error) throw error;
  return true;
};

/**
 * Atualiza nome e slug de uma categoria existente.
 */
export const updateCategory = async (categoryId: string, name: string, value: string) => {
  const { error } = await supabase.from("categories").update({
    name,
    value
  }).eq("id", categoryId);
  if (error) throw error;
  return true;
};
