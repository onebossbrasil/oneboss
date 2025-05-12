
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import { uploadProductImage } from "@/utils/productUtils";

export const useAddProduct = () => {
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

  return {
    isLoading,
    addProduct
  };
};
