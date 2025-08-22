
import { supabase } from "@/integrations/supabase/client";
import { ImportedProduct } from "@/types/csv";

/**
 * Processes a single product import into Supabase
 */
export const importProductToSupabase = async (
  product: ImportedProduct, 
  categoryObj: { id: string | number }
): Promise<{ success: boolean; error?: any }> => {
  try {
    // Parse price - convert string to number
    const priceStr = product.price.replace(/[^\d.,]/g, '').replace(',', '.');
    const price = parseFloat(priceStr);
    
    if (!categoryObj || isNaN(price)) {
      return { success: false, error: 'Invalid category or price' };
    }
    
    // Parse subcategories if present
    const subcategoryValues: Record<string, string> = {};
    if (product.subcategories) {
      const subcatEntries = product.subcategories.split(';');
      subcatEntries.forEach(entry => {
        const [type, value] = entry.split(':');
        if (type && value) {
          subcategoryValues[type.trim()] = value.trim();
        }
      });
    }
    
    // Parse sale price if present
    let salePrice = null;
    if (product.salePrice) {
      const salePriceStr = product.salePrice.replace(/[^\d.,]/g, '').replace(',', '.');
      salePrice = parseFloat(salePriceStr);
      if (isNaN(salePrice)) {
        salePrice = null;
      }
    }
    
    // Insert product into Supabase
    const { data: newProduct, error } = await supabase
      .from('products')
      .insert({
        name: product.name,
        short_description: product.shortDescription || null,
        description: product.description,
        price,
        sale_price: salePrice,
        category_id: categoryObj.id.toString(),
        // subcategory_values removido - agora usa attribute_id
        featured: product.featured,
        published: product.published,
        stock_quantity: product.stockQuantity
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Insert images if any
    if (product.images.length > 0) {
      const imageInserts = product.images.map((imageUrl, index) => ({
        product_id: newProduct.id,
        url: imageUrl,
        sort_order: index
      }));
      
      const { error: imageError } = await supabase
        .from('product_images')
        .insert(imageInserts);
        
      if (imageError) throw imageError;
    }
    
    return { success: true };
  } catch (err) {
    console.error(`Error importing product:`, err);
    return { success: false, error: err };
  }
};

/**
 * Process batch import of multiple products
 */
export const batchImportProducts = async (
  importedProducts: ImportedProduct[], 
  categories: { id: string | number; name: string }[]
): Promise<{ successCount: number; errorCount: number }> => {
  let successCount = 0;
  let errorCount = 0;
  
  for (const product of importedProducts) {
    try {
      // Find category ID
      const categoryObj = categories.find(c => 
        c.name.toLowerCase() === product.category.toLowerCase()
      );
      
      const { success } = await importProductToSupabase(product, categoryObj!);
      
      if (success) {
        successCount++;
      } else {
        errorCount++;
      }
    } catch (err) {
      console.error(`Error importing product:`, err);
      errorCount++;
    }
  }
  
  return { successCount, errorCount };
};
