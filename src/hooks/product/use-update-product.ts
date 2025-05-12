
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import { uploadProductImage, deleteProductImage } from "@/utils/productUtils";

export const useUpdateProduct = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const updateProduct = async (
    id: string, 
    productData: Partial<Product> & { deletedImageIds?: string[] }, 
    newImages?: File[]
  ) => {
    try {
      setIsLoading(true);
      
      // Prepare product data for update
      const updateData: Record<string, any> = {
        updated_at: new Date().toISOString()
      };
      
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
      
      // Check if product exists before attempting update
      const { data: existingProduct, error: checkError } = await supabase
        .from('products')
        .select('id')
        .eq('id', id)
        .single();
        
      if (checkError || !existingProduct) {
        throw new Error('Produto não encontrado. Ele pode ter sido excluído.');
      }
      
      // Update product in database - no user permissions check here
      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id);
        
      if (error) throw error;
      
      // Delete images that were removed in the UI
      if (productData.deletedImageIds && productData.deletedImageIds.length > 0) {
        await Promise.all(
          productData.deletedImageIds.map(imageId => deleteProductImage(imageId))
        );
      }
      
      // Upload new images if any
      if (newImages && newImages.length > 0) {
        // Get current number of images to determine sort_order for new ones
        const { data: existingImages } = await supabase
          .from('product_images')
          .select('*')
          .eq('product_id', id);
          
        const startSortOrder = existingImages ? existingImages.length : 0;
        
        await Promise.all(
          newImages.map((image, index) => 
            uploadProductImage(id, image, startSortOrder + index)
          )
        );
      }
      
      toast({
        title: 'Produto atualizado',
        description: 'O produto foi atualizado com sucesso.',
      });
    } catch (err: any) {
      console.error('Error updating product:', err);
      
      let errorMessage = 'Erro ao atualizar produto.';
      
      if (err.message?.includes('encontrado')) {
        errorMessage = err.message;
      } else if (err.message?.includes('conexão') || err.code === 'PGRST301') {
        errorMessage = 'Falha na conexão com o banco de dados. Verifique sua internet.';
      } else if (err.message?.includes('permission denied')) {
        errorMessage = 'Erro de permissão. Operação permitida apenas para administradores.';
        console.warn('Permission error encountered. In development mode, this is expected due to simulated auth.');
      }
      
      toast({
        title: 'Erro ao atualizar produto',
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
    updateProduct
  };
};
