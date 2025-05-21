import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import { uploadProductImage } from "@/utils/product";
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
      // LOG de diagnóstico do payload convertido para snake_case
      const dbProduct = {
        name: product.name,
        short_description: product.shortDescription || null,
        description: product.description,
        price: product.price,
        sale_price: product.salePrice ?? null,
        category_id: product.categoryId,
        featured: product.featured,
        published: product.published,
        stock_quantity: product.stockQuantity
      };
      console.log("[useAddProduct] Produto (snake_case):", dbProduct);

      if (!session) {
        console.error("[useAddProduct] Tentativa de adicionar produto sem sessão!");
        throw new Error('Você precisa estar autenticado como administrador para adicionar produtos.');
      }
      
      // Diagnóstico antes de inserir
      const { error: connectionError } = await supabase.from('products').select('id').limit(1);
      if (connectionError) {
        console.error("[useAddProduct] Falha de conexão:", connectionError);
        throw new Error('Não foi possível conectar ao banco de dados. Verifique sua conexão.');
      }

      const { data, error } = await supabase
        .from('products')
        .insert(dbProduct)
        .select()
        .single();

      // LOG do Supabase
      console.log("[useAddProduct] Resposta do Supabase INSERT:", { data, error });

      if (error) {
        console.error("[useAddProduct] Erro ao inserir produto:", error);
        throw error;
      }

      if (!data) {
        throw new Error("O produto não foi criado. Verifique os campos obrigatórios e tente novamente.");
      }

      if (images.length > 0) {
        console.log("[useAddProduct] Enviando imagens:", images.length);
        await Promise.all(
          images.map((file, idx) => uploadProductImage(data.id, file, idx))
        );
      }

      toast({
        title: "Produto adicionado",
        description: `${product.name} foi adicionado com sucesso e salvo no Supabase.`,
        variant: 'default'
      });

      return data;
    } catch (err: any) {
      console.error('[useAddProduct] Falha ao adicionar produto:', err);
      let errorMessage = err?.message || 'Erro ao adicionar produto.';
      toast({
        title: "Erro ao adicionar produto",
        description: errorMessage,
        variant: "destructive"
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
