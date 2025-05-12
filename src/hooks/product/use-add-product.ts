
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import { uploadProductImage } from "@/utils/productUtils";
import { useAuth } from "@/contexts/AuthContext";

export const useAddProduct = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useAuth();

  const addProduct = async (
    product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'images'>, 
    images: File[]
  ) => {
    try {
      setIsLoading(true);
      
      if (!session) {
        throw new Error('Você precisa estar autenticado como administrador para adicionar produtos.');
      }
      
      console.log("Adding product with auth:", !!session.access_token);
      
      // Check connection before attempting operation
      const { error: connectionError } = await supabase.from('products').select('id').limit(1);
      if (connectionError) {
        console.error("Connection error:", connectionError);
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
        
      if (error) {
        console.error("Insert error:", error);
        throw error;
      }
      
      console.log("Product added successfully, ID:", data.id);
      
      // Upload images if any
      if (images.length > 0) {
        console.log("Uploading images:", images.length);
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
      } else if (err.code === '42501') {
        errorMessage = 'Permissão negada. Certifique-se de estar logado como administrador.';
      } else if (!session) {
        errorMessage = 'Você precisa estar autenticado como administrador para adicionar produtos.';
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
