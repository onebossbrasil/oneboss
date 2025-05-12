
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
        throw new Error('Você precisa estar autenticado como administrador para remover produtos.');
      }
      
      console.log("Deleting product with ID:", id);
      
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
        
      if (error) {
        console.error("Delete error:", error);
        throw error;
      }
      
      console.log("Product deleted successfully");
      
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
      } else if (err.code === '42501') {
        errorMessage = 'Permissão negada. Certifique-se de estar logado como administrador.';
      } else if (!session) {
        errorMessage = 'Você precisa estar autenticado como administrador para remover produtos.';
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
