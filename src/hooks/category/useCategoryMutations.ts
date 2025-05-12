
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  createCategory,
  deleteCategory,
} from "@/services/category";

export function useCategoryMutations(
  setIsLoading: (loading: boolean) => void,
  fetchCategories: () => Promise<void>
) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const addCategory = async (name: string, value: string) => {
    try {
      setIsLoading(true);
      await createCategory(name, value);
      await fetchCategories();
      
      toast({
        title: 'Categoria adicionada',
        description: `${name} foi adicionada com sucesso.`,
      });
    } catch (err: any) {
      console.error('Error adding category:', err);
      toast({
        title: 'Erro ao adicionar categoria',
        description: err.message || "Erro ao adicionar categoria",
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeCategory = async (categoryId: number) => {
    if (isDeleting) {
      console.log("Deletion already in progress, ignoring request");
      return;
    }
    
    try {
      setIsDeleting(true);
      setIsLoading(true);
      console.log(`Deleting category with ID: ${categoryId}`);
      await deleteCategory(categoryId);
      await fetchCategories();
      
      toast({
        title: 'Categoria removida',
        description: 'A categoria foi removida com sucesso.',
      });
    } catch (err: any) {
      console.error('Error removing category:', err);
      toast({
        title: 'Erro ao remover categoria',
        description: err.message || "Erro ao remover categoria",
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
      setIsDeleting(false);
    }
  };

  return {
    addCategory,
    removeCategory,
    isDeleting
  };
}
