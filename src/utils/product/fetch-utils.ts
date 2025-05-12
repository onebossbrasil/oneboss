
import { Product, ProductImage } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";

// Add timeout to Supabase requests
const fetchWithTimeout = async <T>(promise: Promise<T>, timeoutMs = 10000): Promise<T> => {
  let timeoutId: NodeJS.Timeout;
  
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error('Tempo de conexão esgotado. Verifique sua internet.'));
    }, timeoutMs);
  });
  
  return Promise.race([
    promise,
    timeoutPromise
  ]).then(result => {
    clearTimeout(timeoutId);
    return result as T;
  });
};

export const fetchProductsFromSupabase = async (): Promise<{ products: Product[], error: string | null }> => {
  try {
    console.log("Fetching products from Supabase");
    // Fetch products from Supabase with timeout
    const productsPromise = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
      
    // Create a proper Promise from the Supabase query
    const productsResult = await fetchWithTimeout(Promise.resolve(productsPromise));

    if (productsResult.error) {
      console.error("Error fetching products:", productsResult.error);
      throw productsResult.error;
    }

    // Fetch all product images with timeout
    const imagesPromise = supabase
      .from('product_images')
      .select('*')
      .order('sort_order');
      
    // Create a proper Promise from the Supabase query
    const imagesResult = await fetchWithTimeout(Promise.resolve(imagesPromise));

    if (imagesResult.error) {
      console.error("Error fetching product images:", imagesResult.error);
      throw imagesResult.error;
    }

    // Map images to their products
    const imagesByProduct: Record<string, ProductImage[]> = {};
    
    imagesResult.data.forEach((image: any) => {
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
    const formattedProducts: Product[] = productsResult.data.map((product: any) => ({
      id: product.id,
      name: product.name,
      shortDescription: product.short_description || '',
      description: product.description || '',
      price: parseFloat(product.price),
      salePrice: product.sale_price ? parseFloat(product.sale_price) : null,
      categoryId: product.category_id,
      subcategoryValues: product.subcategory_values || {},
      featured: product.featured || false,
      published: product.published !== undefined ? product.published : true,
      stockQuantity: product.stock_quantity || 0,
      images: imagesByProduct[product.id] || [],
      createdAt: product.created_at,
      updatedAt: product.updated_at
    }));

    return { products: formattedProducts, error: null };
  } catch (err: any) {
    console.error('Error fetching products:', err);
    
    // Categorize error messages for better user feedback
    let errorMessage: string;
    if (err.code === 'PGRST301') {
      errorMessage = 'Erro de autenticação. Faça login novamente.';
    } else if (err.message?.includes('timeout') || err.message?.includes('fetch')) {
      errorMessage = 'Falha na conexão com o servidor. Verifique sua internet.';
    } else if (err.code?.includes('auth')) {
      errorMessage = 'Sessão expirada ou inválida. Faça login novamente.';
    } else {
      errorMessage = err.message || 'Erro desconhecido ao buscar produtos.';
    }
    
    return { products: [], error: errorMessage };
  }
};
