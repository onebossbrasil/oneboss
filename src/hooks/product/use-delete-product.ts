
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const useDeleteProduct = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useAuth();

  const deleteProduct = async (id: string) => {
    try {
      setIsLoading(true);

      if (!session) {
        console.error("[useDeleteProduct] Tentativa de excluir produto sem sessão!");
        throw new Error('Você precisa estar autenticado como administrador para remover produtos.');
      }

      // Diagnóstico: checagem do produto antes
      const { data: existingProduct, error: checkError } = await supabase
        .from('products')
        .select('id, name')
        .eq('id', id)
        .single();

      if (checkError || !existingProduct) {
        console.warn("[useDeleteProduct] Produto não encontrado na exclusão.", checkError);
        throw new Error('Produto não encontrado. Ele já pode ter sido excluído.');
      }

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("[useDeleteProduct] Erro ao excluir produto:", error);
        throw error;
      }

      console.log("[useDeleteProduct] Produto removido com sucesso:", id);

      toast({
        title: 'Produto removido',
        description: `${existingProduct.name} foi removido do Supabase.`,
        variant: 'default'
      });
    } catch (err: any) {
      console.error('[useDeleteProduct] Falha ao remover produto:', err);
      let errorMessage = 'Erro ao remover produto.';
      if (err.message?.includes('encontrado')) errorMessage = err.message;
      else if (err.message?.includes('conexão') || err.code === 'PGRST301') errorMessage = 'Falha na conexão com o banco de dados.';
      else if (err.code === '42501') errorMessage = 'Permissão negada.';
      else if (!session) errorMessage = 'Você precisa estar autenticado como administrador.';
      toast({
        title: 'Erro ao remover produto',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    deleteProduct
  };
};
