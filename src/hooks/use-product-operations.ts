
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import { uploadProductImage } from "@/utils/productUtils";

export const useProductOperations = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const addProduct = async (
    product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'images'>, 
    images: File[]
  ) => {
    try {
      setIsLoading(true);
      
      // Check connection before attempting operation
      const { error: connectionError } = await supabase.from('products').select('id').limit(1);
      if (connectionError) {
        throw new Error('Não foi possível conectar ao banco de dados. Verifique sua conexão.');
      }
      
      // Insert new product
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: product.name,
          short_description: product.shortDescription,
          description: product.description,
          price: product.price,
          sale_price: product.salePrice,
          category_id: product.categoryId,
          subcategory_values: product.subcategoryValues,
          featured: product.featured,
          published: product.published,
          stock_quantity: product.stockQuantity
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Upload images if any
      if (images.length > 0) {
        await Promise.all(
          images.map((image, index) => 
            uploadProductImage(data.id, image, index)
          )
        );
      }
      
      toast({
        title: 'Produto adicionado',
        description: `${product.name} foi adicionado com sucesso.`,
      });

      return data;
    } catch (err: any) {
      console.error('Error adding product:', err);
      
      let errorMessage = 'Erro ao adicionar produto.';
      
      if (err.message?.includes('conexão') || err.code === 'PGRST301') {
        errorMessage = 'Falha na conexão com o banco de dados. Verifique sua internet.';
      } else if (err.code === '23505') {
        errorMessage = 'Já existe um produto com este nome.';
      } else if (err.code === '23502') {
        errorMessage = 'Campos obrigatórios não preenchidos.';
      }
      
      toast({
        title: 'Erro ao adicionar produto',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (
    id: string, 
    productData: Partial<Product>, 
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
      
      // Update product in database
      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id);
        
      if (error) throw error;
      
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
    addProduct,
    updateProduct,
    deleteProduct
  };
};
