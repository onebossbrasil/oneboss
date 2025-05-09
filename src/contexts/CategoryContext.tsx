
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type SubcategoryType = {
  id: number;
  name: string;
  type: string;
  values: string[];
};

export type CategoryType = {
  id: number;
  name: string;
  value: string;
  subcategories: SubcategoryType[];
};

type CategoryContextType = {
  categories: CategoryType[];
  isLoading: boolean;
  error: string | null;
  addCategory: (name: string, value: string) => Promise<void>;
  removeCategory: (categoryId: number) => Promise<void>;
  addSubcategory: (categoryId: number, name: string, type: string) => Promise<void>;
  removeSubcategory: (categoryId: number, subcategoryId: number) => Promise<void>;
  addSubcategoryValue: (categoryId: number, subcategoryId: number, value: string) => Promise<void>;
  removeSubcategoryValue: (categoryId: number, subcategoryId: number, value: string) => Promise<void>;
  refreshCategories: () => Promise<void>;
};

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);

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

      // Group subcategories by category
      const subcategoriesByCategory: Record<string, any[]> = {};
      subcategoriesData.forEach((subcategory: any) => {
        if (!subcategoriesByCategory[subcategory.category_id]) {
          subcategoriesByCategory[subcategory.category_id] = [];
        }
        subcategoriesByCategory[subcategory.category_id].push(subcategory);
      });

      // Group values by subcategory
      const valuesBySubcategory: Record<string, string[]> = {};
      valuesData.forEach((value: any) => {
        if (!valuesBySubcategory[value.subcategory_id]) {
          valuesBySubcategory[value.subcategory_id] = [];
        }
        valuesBySubcategory[value.subcategory_id].push(value.value);
      });

      // Build complete category objects
      const formattedCategories: CategoryType[] = categoriesData.map((category: any) => {
        const categorySubcategories = subcategoriesByCategory[category.id] || [];
        
        return {
          id: parseInt(category.id.toString(), 10), // Convert UUID to number for compatibility
          name: category.name,
          value: category.value,
          subcategories: categorySubcategories.map((subcategory: any) => ({
            id: parseInt(subcategory.id.toString(), 10),
            name: subcategory.name,
            type: subcategory.type,
            values: valuesBySubcategory[subcategory.id] || []
          }))
        };
      });

      setCategories(formattedCategories);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError(err.message);
      toast({
        title: 'Erro ao carregar categorias',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addCategory = async (name: string, value: string) => {
    try {
      setIsLoading(true);
      
      // Insert new category without requiring authentication
      const { data, error } = await supabase
        .from('categories')
        .insert({ name, value })
        .select()
        .single();
        
      if (error) throw error;
      
      // Refresh categories
      await fetchCategories();
      
      toast({
        title: 'Categoria adicionada',
        description: `${name} foi adicionada com sucesso.`,
      });
    } catch (err: any) {
      console.error('Error adding category:', err);
      toast({
        title: 'Erro ao adicionar categoria',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeCategory = async (categoryId: number) => {
    try {
      setIsLoading(true);
      
      // Find the category in our state to get its real UUID
      const category = categories.find(cat => cat.id === categoryId);
      if (!category) throw new Error('Categoria não encontrada');
      
      // Delete from Supabase (subcategories will be deleted by CASCADE)
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', category.id.toString());
        
      if (error) throw error;
      
      // Refresh categories
      await fetchCategories();
      
      toast({
        title: 'Categoria removida',
        description: 'A categoria foi removida com sucesso.',
      });
    } catch (err: any) {
      console.error('Error removing category:', err);
      toast({
        title: 'Erro ao remover categoria',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addSubcategory = async (categoryId: number, name: string, type: string) => {
    try {
      setIsLoading(true);
      
      // Find the category in our state to get its real UUID
      const category = categories.find(cat => cat.id === categoryId);
      if (!category) throw new Error('Categoria não encontrada');
      
      // Insert subcategory
      const { data, error } = await supabase
        .from('subcategories')
        .insert({ 
          category_id: category.id.toString(),
          name,
          type
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Refresh categories
      await fetchCategories();
      
      toast({
        title: 'Subcategoria adicionada',
        description: `${name} foi adicionada com sucesso.`,
      });
    } catch (err: any) {
      console.error('Error adding subcategory:', err);
      toast({
        title: 'Erro ao adicionar subcategoria',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeSubcategory = async (categoryId: number, subcategoryId: number) => {
    try {
      setIsLoading(true);
      
      // Find the subcategory to get its real UUID
      const category = categories.find(cat => cat.id === categoryId);
      if (!category) throw new Error('Categoria não encontrada');
      
      const subcategory = category.subcategories.find(sub => sub.id === subcategoryId);
      if (!subcategory) throw new Error('Subcategoria não encontrada');
      
      // Delete from Supabase (values will be deleted by CASCADE)
      const { error } = await supabase
        .from('subcategories')
        .delete()
        .eq('id', subcategory.id.toString());
        
      if (error) throw error;
      
      // Refresh categories
      await fetchCategories();
      
      toast({
        title: 'Subcategoria removida',
        description: 'A subcategoria foi removida com sucesso.',
      });
    } catch (err: any) {
      console.error('Error removing subcategory:', err);
      toast({
        title: 'Erro ao remover subcategoria',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addSubcategoryValue = async (categoryId: number, subcategoryId: number, value: string) => {
    try {
      setIsLoading(true);
      
      // Find the subcategory to get its real UUID
      const category = categories.find(cat => cat.id === categoryId);
      if (!category) throw new Error('Categoria não encontrada');
      
      const subcategory = category.subcategories.find(sub => sub.id === subcategoryId);
      if (!subcategory) throw new Error('Subcategoria não encontrada');
      
      // Insert value
      const { error } = await supabase
        .from('subcategory_values')
        .insert({ 
          subcategory_id: subcategory.id.toString(),
          value
        });
        
      if (error) throw error;
      
      // Refresh categories
      await fetchCategories();
      
      toast({
        title: 'Valor adicionado',
        description: `${value} foi adicionado com sucesso.`,
      });
    } catch (err: any) {
      console.error('Error adding subcategory value:', err);
      toast({
        title: 'Erro ao adicionar valor',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeSubcategoryValue = async (categoryId: number, subcategoryId: number, value: string) => {
    try {
      setIsLoading(true);
      
      // Find the subcategory to get its real UUID
      const category = categories.find(cat => cat.id === categoryId);
      if (!category) throw new Error('Categoria não encontrada');
      
      const subcategory = category.subcategories.find(sub => sub.id === subcategoryId);
      if (!subcategory) throw new Error('Subcategoria não encontrada');
      
      // Delete value - we need to find it first by querying
      const { data: valueData, error: findError } = await supabase
        .from('subcategory_values')
        .select('id')
        .eq('subcategory_id', subcategory.id.toString())
        .eq('value', value)
        .single();
        
      if (findError) throw findError;
      if (!valueData) throw new Error('Valor não encontrado');
      
      const { error } = await supabase
        .from('subcategory_values')
        .delete()
        .eq('id', valueData.id);
        
      if (error) throw error;
      
      // Refresh categories
      await fetchCategories();
      
      toast({
        title: 'Valor removido',
        description: `${value} foi removido com sucesso.`,
      });
    } catch (err: any) {
      console.error('Error removing subcategory value:', err);
      toast({
        title: 'Erro ao remover valor',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCategories = () => fetchCategories();

  return (
    <CategoryContext.Provider value={{
      categories,
      isLoading,
      error,
      addCategory,
      removeCategory,
      addSubcategory,
      removeSubcategory,
      addSubcategoryValue,
      removeSubcategoryValue,
      refreshCategories
    }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
};
