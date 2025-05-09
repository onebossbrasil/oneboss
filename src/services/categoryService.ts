
import { supabase } from "@/integrations/supabase/client";
import { CategoryType } from "@/types/category";

// Fetch all categories and their subcategories
export const fetchCategoriesData = async () => {
  // Fetch categories
  const { data: categoriesData, error: categoriesError } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (categoriesError) throw categoriesError;

  // Fetch subcategories
  const { data: subcategoriesData, error: subcategoriesError } = await supabase
    .from('subcategories')
    .select('*')
    .order('name');

  if (subcategoriesError) throw subcategoriesError;

  // Fetch subcategory values
  const { data: valuesData, error: valuesError } = await supabase
    .from('subcategory_values')
    .select('*');

  if (valuesError) throw valuesError;

  return { categoriesData, subcategoriesData, valuesData };
};

// Create a new category
export const createCategory = async (name: string, value: string) => {
  const { data, error } = await supabase
    .from('categories')
    .insert({ name, value })
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

// Delete a category
export const deleteCategory = async (categoryId: number) => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', categoryId.toString());
    
  if (error) throw error;
};

// Create a subcategory
export const createSubcategory = async (categoryId: number, name: string, type: string) => {
  const { data, error } = await supabase
    .from('subcategories')
    .insert({ 
      category_id: categoryId.toString(),
      name,
      type
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

// Delete a subcategory
export const deleteSubcategory = async (subcategoryId: number) => {
  const { error } = await supabase
    .from('subcategories')
    .delete()
    .eq('id', subcategoryId.toString());
    
  if (error) throw error;
};

// Add a value to a subcategory
export const addSubcategoryValue = async (subcategoryId: number | string, value: string, categoryId: number | string) => {
  const { error } = await supabase
    .from('subcategory_values')
    .insert({ 
      subcategory_id: subcategoryId.toString(),
      value
    });
    
  if (error) throw error;
};

// Remove a value from a subcategory
export const removeSubcategoryValue = async (subcategoryId: number | string, value: string, categoryId: number | string) => {
  // Find the value first
  const { data: valueData, error: findError } = await supabase
    .from('subcategory_values')
    .select('id')
    .eq('subcategory_id', subcategoryId.toString())
    .eq('value', value)
    .single();
    
  if (findError) throw findError;
  if (!valueData) throw new Error('Valor não encontrado');
  
  // Delete the value
  const { error } = await supabase
    .from('subcategory_values')
    .delete()
    .eq('id', valueData.id);
    
  if (error) throw error;
};
