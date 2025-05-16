import { useToast } from "@/hooks/use-toast";
import {
  createSubcategory,
  deleteSubcategory,
} from "@/services/category";
import { isValidUuid } from "@/utils/validateUuid";

export function useSubcategoryMutations(
  setIsLoading: (loading: boolean) => void,
  fetchCategories: () => Promise<void>
) {
  const { toast } = useToast();

  const addSubcategory = async (categoryId: number | string, name: string, type: string) => {
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

  const removeSubcategory = async (categoryId: number | string, subcategoryId: number | string) => {
    if (!isValidUuid(String(subcategoryId))) {
      toast({
        title: "ID de subcategoria inválido",
        description: `O identificador recebido (${subcategoryId}) não está no formato UUID válido.`,
        variant: "destructive"
      });
      return;
    }
    try {
      setIsLoading(true);
      await deleteSubcategory(subcategoryId as any);
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
