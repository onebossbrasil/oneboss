import { supabase } from "@/integrations/supabase/client";

export const uploadProductImage = async (productId: string, imageFile: File, sortOrder: number = 0) => {
  try {
    console.log("Uploading image for product:", productId);
    // Create a unique file name
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${productId}/${Date.now()}.${fileExt}`;
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('products')
      .upload(fileName, imageFile);
    
    if (uploadError) {
      console.error("Error uploading to storage:", uploadError);
      throw uploadError;
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('products')
      .getPublicUrl(fileName);
    
    const publicUrl = urlData.publicUrl;
    console.log("Image uploaded, public URL:", publicUrl);
    
    // Save image information to the database
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
      console.error("Error saving image to database:", imageError);
      throw imageError;
    }
    
    return imageData;
  } catch (err: any) {
    console.error('Error uploading product image:', err);
    
    // Provide more specific error messages
    if (err.message?.includes('storage')) {
      throw new Error('Falha ao enviar imagem. O servidor de armazenamento pode estar indisponível.');
    } else if (err.message?.includes('quota')) {
      throw new Error('Limite de armazenamento excedido. Remova algumas imagens antigas.');
    } else {
      throw err;
    }
  }
};

// New function to delete product images
export const deleteProductImage = async (imageId: string) => {
  try {
    console.log("Deleting product image:", imageId);
    // First, get the image URL to extract the file path for storage deletion
    const { data: imageData, error: fetchError } = await supabase
      .from('product_images')
      .select('url')
      .eq('id', imageId)
      .single();
    
    if (fetchError) {
      console.error("Error fetching image before deletion:", fetchError);
      throw fetchError;
    }
    
    // Delete the entry from the database
    const { error: deleteError } = await supabase
      .from('product_images')
      .delete()
      .eq('id', imageId);
    
    if (deleteError) {
      console.error("Error deleting image from database:", deleteError);
      throw deleteError;
    }
    
    console.log("Image deleted from database successfully");
    
    // Extract file path from URL to delete from storage
    // This is optional as we may want to keep files in storage
    // Format is typically: https://[storage-url]/storage/v1/object/public/products/[product-id]/[filename]
    try {
      const url = new URL(imageData.url);
      const pathSegments = url.pathname.split('/');
      const bucketName = 'products';
      
      // Extract the path after the bucket name (product_id/filename)
      const filePath = pathSegments.slice(pathSegments.indexOf('products') + 1).join('/');
      
      // Delete file from storage if path was extracted properly
      if (filePath) {
        await supabase.storage
          .from(bucketName)
          .remove([filePath]);
        console.log("Image file deleted from storage:", filePath);
      }
    } catch (storageErr) {
      console.warn('Could not delete image file from storage:', storageErr);
      // Don't throw here, as the database record is already deleted
    }
    
    return { success: true };
  } catch (err: any) {
    console.error('Error deleting product image:', err);
    throw new Error('Falha ao excluir a imagem do produto.');
  }
};
