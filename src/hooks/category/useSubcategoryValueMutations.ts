import { useToast } from "@/hooks/use-toast";
import {
  addSubcategoryValue as addSubcategoryValueService,
  removeSubcategoryValue as removeSubcategoryValueService
} from "@/services/category";
import { isValidUuid } from "@/utils/validateUuid";

export function useSubcategoryValueMutations(
  setIsLoading: (loading: boolean) => void,
  fetchCategories: () => Promise<void>
) {
  const { toast } = useToast();

  const addSubcategoryValue = async (categoryId: number | string, subcategoryId: number | string, value: string) => {
    try {
      setIsLoading(true);
      await addSubcategoryValueService(subcategoryId, value, categoryId);
      await fetchCategories();
      
      toast({
        title: 'Valor adicionado',
        description: `${value} foi adicionado com sucesso.`,
      });
    } catch (err: any) {
      console.error('Error adding subcategory value:', err);
      toast({
        title: 'Erro ao adicionar valor',
        description: err.message || "Erro ao adicionar valor",
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeSubcategoryValue = async (categoryId: number | string, subcategoryId: number | string, value: string) => {
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
      await removeSubcategoryValueService(subcategoryId as any, value, categoryId as any);
      await fetchCategories();
      
      toast({
        title: 'Valor removido',
        description: `${value} foi removido com sucesso.`,
      });
    } catch (err: any) {
      console.error('Error removing subcategory value:', err);
      toast({
        title: 'Erro ao remover valor',
        description: err.message || "Erro ao remover valor",
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addSubcategoryValue,
    removeSubcategoryValue,
  };
}
