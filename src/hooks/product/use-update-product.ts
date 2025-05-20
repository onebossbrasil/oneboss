
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import { uploadProductImage, deleteProductImage } from "@/utils/product";
import { useAuth } from "@/contexts/AuthContext";

export const useUpdateProduct = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { session, user } = useAuth();

  const updateProduct = async (
    id: string, 
    productData: Partial<Product> & { deletedImageIds?: string[] }, 
    newImages?: File[]
  ) => {
    try {
      setIsLoading(true);
      console.log("[useUpdateProduct] Atualizando produto:", id, productData);

      if (!session) {
        console.error("[useUpdateProduct] Sem sessão!");
        throw new Error('Você precisa estar autenticado como administrador para editar produtos.');
      }

      // Diagnóstico de existência do produto
      const { data: existingProduct, error: checkError } = await supabase
        .from('products')
        .select('id')
        .eq('id', id)
        .single();
        
      if (checkError || !existingProduct) {
        console.warn("[useUpdateProduct] Produto não encontrado antes do update.", checkError);
        throw new Error('Produto não encontrado. Ele pode ter sido excluído.');
      }

      // Prepara e atualiza
      const updateData: Record<string, any> = {
        updated_at: new Date().toISOString()
      };
      // ... preenchimento igual já tinha antes ...
      if (productData.name !== undefined) updateData.name = productData.name;
      if (productData.shortDescription !== undefined) updateData.short_description = productData.shortDescription;
      if (productData.description !== undefined) updateData.description = productData.description;
      if (productData.price !== undefined) updateData.price = productData.price;
      if (productData.salePrice !== undefined) updateData.sale_price = productData.salePrice;
      if (productData.categoryId !== undefined) updateData.category_id = productData.categoryId;
      if (productData.subcategoryValues !== undefined) updateData.subcategory_values = productData.subcategoryValues;
      if (productData.featured !== undefined) updateData.featured = productData.featured;
      if (productData.published !== undefined) updateData.published = productData.published;
      if (productData.stockQuantity !== undefined) updateData.stock_quantity = productData.stockQuantity;

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error("[useUpdateProduct] Erro ao atualizar produto:", error);
        throw error;
      }

      console.log("[useUpdateProduct] Produto atualizado com sucesso!", id);

      // Gerenciamento de imagens
      if (productData.deletedImageIds && productData.deletedImageIds.length > 0) {
        console.log("[useUpdateProduct] Removendo imagens do produto:", productData.deletedImageIds);
        await Promise.all(
          productData.deletedImageIds.map(imageId => deleteProductImage(imageId))
        );
      }

      if (newImages && newImages.length > 0) {
        const { data: existingImages } = await supabase
          .from('product_images')
          .select('*')
          .eq('product_id', id);
        const startSortOrder = existingImages ? existingImages.length : 0;
        console.log("[useUpdateProduct] Enviando novas imagens. Ordem inicial:", startSortOrder);
        await Promise.all(
          newImages.map((img, idx) =>
            uploadProductImage(id, img, startSortOrder + idx)
          )
        );
      }

      toast({
        title: 'Produto atualizado',
        description: 'O produto foi atualizado e salvo no Supabase.',
        variant: "default"
      });
    } catch (err: any) {
      console.error('[useUpdateProduct] Falha ao atualizar produto:', err);
      let errorMessage = 'Erro ao atualizar produto.';
      if (err.message?.includes('encontrado')) errorMessage = err.message;
      else if (err.message?.includes('conexão') || err.code === 'PGRST301') errorMessage = 'Falha na conexão com o banco de dados.';
      else if (err.code === '42501') errorMessage = 'Permissão negada.';
      else if (!session) errorMessage = 'Você precisa estar autenticado como administrador.';
      else if (!user) errorMessage = 'Usuário não encontrado na sessão.';
      else errorMessage = `Erro: ${err.message || 'Erro desconhecido'}`;
      toast({ title: 'Erro ao atualizar produto', description: errorMessage, variant: 'destructive' });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    updateProduct
  };
};
