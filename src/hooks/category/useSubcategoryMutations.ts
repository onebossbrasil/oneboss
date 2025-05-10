
import { useToast } from "@/hooks/use-toast";
import {
  createSubcategory,
  deleteSubcategory,
} from "@/services/category";

export function useSubcategoryMutations(
  setIsLoading: (loading: boolean) => void,
  fetchCategories: () => Promise<void>
) {
  const { toast } = useToast();

  const addSubcategory = async (categoryId: number, name: string, type: string) => {
    try {
      setIsLoading(true);
      await createSubcategory(categoryId, name, type);
      await fetchCategories();
      
      toast({
        title: 'Subcategoria adicionada',
        description: `${name} foi adicionada com sucesso.`,
      });
    } catch (err: any) {
      console.error('Error adding subcategory:', err);
      toast({
        title: 'Erro ao adicionar subcategoria',
        description: err.message || "Erro ao adicionar subcategoria",
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeSubcategory = async (categoryId: number, subcategoryId: number) => {
    try {
      setIsLoading(true);
      await deleteSubcategory(subcategoryId);
      await fetchCategories();
      
      toast({
        title: 'Subcategoria removida',
        description: 'A subcategoria foi removida com sucesso.',
      });
    } catch (err: any) {
      console.error('Error removing subcategory:', err);
      toast({
        title: 'Erro ao remover subcategoria',
        description: err.message || "Erro ao remover subcategoria",
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addSubcategory,
    removeSubcategory,
  };
}
