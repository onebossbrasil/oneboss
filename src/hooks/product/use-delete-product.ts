
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useDeleteProduct = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const deleteProduct = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Check if product exists before attempting delete
      const { data: existingProduct, error: checkError } = await supabase
        .from('products')
        .select('id, name')
        .eq('id', id)
        .single();
        
      if (checkError || !existingProduct) {
        throw new Error('Produto não encontrado. Ele já pode ter sido excluído.');
      }
      
      // Delete product (images will be automatically deleted due to CASCADE)
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Produto removido',
        description: `${existingProduct.name} foi removido com sucesso.`,
      });
    } catch (err: any) {
      console.error('Error deleting product:', err);
      
      let errorMessage = 'Erro ao remover produto.';
      
      if (err.message?.includes('encontrado')) {
        errorMessage = err.message;
      } else if (err.message?.includes('conexão') || err.code === 'PGRST301') {
        errorMessage = 'Falha na conexão com o banco de dados. Verifique sua internet.';
      } 
      
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
