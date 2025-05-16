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

  const addSubcategoryValue = async (categoryId: string, subcategoryId: string, value: string) => {
    try {
      setIsLoading(true);
      await addSubcategoryValueService(subcategoryId, value, categoryId);
      await fetchCategories();

      toast({
        title: 'Atributo adicionado',
        description: `${value} foi adicionado com sucesso.`,
      });
    } catch (err: any) {
      console.error('Error adding subcategory attribute:', err);
      toast({
        title: 'Erro ao adicionar atributo',
        description: err.message || "Erro ao adicionar atributo",
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeSubcategoryValue = async (categoryId: string, subcategoryId: string, value: string) => {
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
        title: 'Atributo removido',
        description: `${value} foi removido com sucesso.`,
      });
    } catch (err: any) {
      console.error('Error removing subcategory attribute:', err);
      toast({
        title: 'Erro ao remover atributo',
        description: err.message || "Erro ao remover atributo",
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
