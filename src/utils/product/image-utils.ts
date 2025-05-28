
import { supabase } from "@/integrations/supabase/client";

export const uploadProductImage = async (productId: string, imageFile: File, sortOrder: number = 0, retryCount: number = 0) => {
  const MAX_RETRIES = 3;
  
  try {
    console.log(`[uploadProductImage] Iniciando upload para produto ${productId}, arquivo: ${imageFile.name}, tentativa: ${retryCount + 1}`);
    
    // Create a unique file name
    const fileExt = imageFile.name.split('.').pop();
    const timestamp = Date.now();
    const fileName = `${productId}/${timestamp}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    
    console.log(`[uploadProductImage] Nome do arquivo gerado: ${fileName}`);
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('products')
      .upload(fileName, imageFile);
    
    if (uploadError) {
      console.error(`[uploadProductImage] Erro no upload para storage:`, uploadError);
      throw uploadError;
    }
    
    console.log(`[uploadProductImage] Upload para storage bem-sucedido:`, uploadData);
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('products')
      .getPublicUrl(fileName);
    
    const publicUrl = urlData.publicUrl;
    console.log(`[uploadProductImage] URL pública gerada: ${publicUrl}`);
    
    // MELHORADO: Verificação mais robusta de duplicatas
    const { data: existingImage, error: checkError } = await supabase
      .from('product_images')
      .select('id, url')
      .eq('product_id', productId)
      .eq('url', publicUrl)
      .maybeSingle();
    
    if (checkError) {
      console.error(`[uploadProductImage] Erro verificando imagem existente:`, checkError);
      throw checkError;
    }
    
    if (existingImage) {
      console.log(`[uploadProductImage] Imagem já existe no banco, retornando existente:`, existingImage.id);
      return existingImage;
    }
    
    // Save image information to the database
    console.log(`[uploadProductImage] Salvando no banco: product_id=${productId}, url=${publicUrl}, sort_order=${sortOrder}`);
    
    const { data: imageData, error: imageError } = await supabase
      .from('product_images')
      .insert({
        product_id: productId,
        url: publicUrl,
        sort_order: sortOrder
      })
      .select()
      .single();
    
    if (imageError) {
      console.error(`[uploadProductImage] Erro salvando no banco:`, imageError);
      
      // Se der erro de constraint (duplicata), tentar buscar a existente
      if (imageError.code === '23505') {
        console.log(`[uploadProductImage] Constraint de duplicata detectada, buscando imagem existente`);
        const { data: existingData, error: fetchError } = await supabase
          .from('product_images')
          .select()
          .eq('product_id', productId)
          .eq('url', publicUrl)
          .maybeSingle();
        
        if (!fetchError && existingData) {
          console.log(`[uploadProductImage] Imagem duplicada encontrada:`, existingData.id);
          return existingData;
        }
      }
      
      throw imageError;
    }
    
    console.log(`[uploadProductImage] Imagem salva com sucesso no banco:`, imageData);
    return imageData;
    
  } catch (err: any) {
    console.error(`[uploadProductImage] Erro na tentativa ${retryCount + 1}:`, err);
    
    // NOVO: Retry automático para falhas de rede
    if (retryCount < MAX_RETRIES && (
      err.message?.includes('network') || 
      err.message?.includes('timeout') ||
      err.message?.includes('fetch')
    )) {
      console.log(`[uploadProductImage] Tentando novamente em 2 segundos... (${retryCount + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return uploadProductImage(productId, imageFile, sortOrder, retryCount + 1);
    }
    
    // Provide more specific error messages
    if (err.message?.includes('storage')) {
      throw new Error('Falha ao enviar imagem. O servidor de armazenamento pode estar indisponível.');
    } else if (err.message?.includes('quota')) {
      throw new Error('Limite de armazenamento excedido. Remova algumas imagens antigas.');
    } else {
      throw new Error(`Erro no upload da imagem ${imageFile.name}: ${err.message}`);
    }
  }
};

// MELHORADO: Função de deletar com melhor logging
export const deleteProductImage = async (imageId: string) => {
  try {
    console.log(`[deleteProductImage] Iniciando deleção da imagem: ${imageId}`);
    
    // First, get the image URL to extract the file path for storage deletion
    const { data: imageData, error: fetchError } = await supabase
      .from('product_images')
      .select('url, product_id')
      .eq('id', imageId)
      .single();
    
    if (fetchError) {
      console.error(`[deleteProductImage] Erro buscando imagem:`, fetchError);
      throw fetchError;
    }
    
    console.log(`[deleteProductImage] Imagem encontrada:`, imageData);
    
    // Delete the entry from the database
    const { error: deleteError } = await supabase
      .from('product_images')
      .delete()
      .eq('id', imageId);
    
    if (deleteError) {
      console.error(`[deleteProductImage] Erro deletando do banco:`, deleteError);
      throw deleteError;
    }
    
    console.log(`[deleteProductImage] Imagem deletada do banco com sucesso`);
    
    // Extract file path from URL to delete from storage
    try {
      const url = new URL(imageData.url);
      const pathSegments = url.pathname.split('/');
      const bucketName = 'products';
      
      // Extract the path after the bucket name (product_id/filename)
      const filePath = pathSegments.slice(pathSegments.indexOf('products') + 1).join('/');
      
      // Delete file from storage if path was extracted properly
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from(bucketName)
          .remove([filePath]);
        
        if (storageError) {
          console.warn(`[deleteProductImage] Erro deletando arquivo do storage:`, storageError);
        } else {
          console.log(`[deleteProductImage] Arquivo deletado do storage: ${filePath}`);
        }
      }
    } catch (storageErr) {
      console.warn(`[deleteProductImage] Não foi possível deletar arquivo do storage:`, storageErr);
      // Don't throw here, as the database record is already deleted
    }
    
    return { success: true };
  } catch (err: any) {
    console.error(`[deleteProductImage] Erro geral:`, err);
    throw new Error('Falha ao excluir a imagem do produto.');
  }
};
