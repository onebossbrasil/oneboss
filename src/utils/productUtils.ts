
import { Product, ProductImage } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";

export const fetchProductsFromSupabase = async (): Promise<{ products: Product[], error: string | null }> => {
  try {
    // Fetch products from Supabase
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (productsError) {
      throw productsError;
    }

    // Fetch all product images
    const { data: imagesData, error: imagesError } = await supabase
      .from('product_images')
      .select('*')
      .order('sort_order');

    if (imagesError) {
      throw imagesError;
    }

    // Map images to their products
    const imagesByProduct: Record<string, ProductImage[]> = {};
    
    imagesData.forEach((image: any) => {
      if (!imagesByProduct[image.product_id]) {
        imagesByProduct[image.product_id] = [];
      }
      
      imagesByProduct[image.product_id].push({
        id: image.id,
        url: image.url,
        sortOrder: image.sort_order
      });
    });

    // Create final products array with images
    const formattedProducts: Product[] = productsData.map((product: any) => ({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: parseFloat(product.price),
      categoryId: product.category_id,
      subcategoryValues: product.subcategory_values || {},
      featured: product.featured || false,
      stockQuantity: product.stock_quantity || 0,
      images: imagesByProduct[product.id] || [],
      createdAt: product.created_at,
      updatedAt: product.updated_at
    }));

    return { products: formattedProducts, error: null };
  } catch (err: any) {
    console.error('Error fetching products:', err);
    return { products: [], error: err.message };
  }
};

export const uploadProductImage = async (productId: string, imageFile: File, sortOrder: number = 0) => {
  try {
    // Create a unique file name
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${productId}/${Date.now()}.${fileExt}`;
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('products')
      .upload(fileName, imageFile);
    
    if (uploadError) throw uploadError;
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('products')
      .getPublicUrl(fileName);
    
    const publicUrl = urlData.publicUrl;
    
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
    
    if (imageError) throw imageError;
    
    return imageData;
  } catch (err) {
    console.error('Error uploading product image:', err);
    throw err;
  }
};
