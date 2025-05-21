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

    // Busca principal dos produtos
    const productsPromise = supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true });
    const productsResult = await fetchWithTimeout(Promise.resolve(productsPromise));

    if (productsResult.error) {
      console.error("Error fetching products:", productsResult.error);
      throw productsResult.error;
    }

    // Busca todas imagens, sem limite e SEM FILTRO DE QUANTIDADE
    const imagesPromise = supabase
      .from('product_images')
      .select('*')
      .order('sort_order', { ascending: true }); // Garante todas e ordena
    const imagesResult = await fetchWithTimeout(Promise.resolve(imagesPromise));

    if (imagesResult.error) {
      console.error("Error fetching product images:", imagesResult.error);
      throw imagesResult.error;
    }

    // Mapeia todas imagens para products, garantindo sempre array válido
    const imagesByProduct: Record<string, ProductImage[]> = {};
    if (imagesResult.data && Array.isArray(imagesResult.data)) {
      imagesResult.data.forEach((image: any) => {
        if (!image.product_id || !image.url) return; // só imagens válidas
        if (!imagesByProduct[image.product_id]) {
          imagesByProduct[image.product_id] = [];
        }
        // Sanitização de url: só entra se começar com https://gytzdhfbmmrsanrhquut.supabase.co/
        if (
          typeof image.url === 'string' &&
          image.url.startsWith('https://gytzdhfbmmrsanrhquut.supabase.co/storage/v1/object/public/products/')
        ) {
          imagesByProduct[image.product_id].push({
            id: image.id,
            url: image.url,
            sortOrder: image.sort_order ?? 0,
          });
        }
      });
    }

    // Garante que nunca será undefined, sempre [] se não houver imagens
    const formattedProducts: Product[] = productsResult.data.map((product: any) => ({
      id: product.id,
      name: product.name,
      shortDescription: product.short_description || '',
      description: product.description || '',
      price: parseFloat(product.price),
      salePrice: product.sale_price ? parseFloat(product.sale_price) : null,
      categoryId: product.category_id,
      subcategoryId: product.subcategory_id ?? null,
      attributeId: product.attribute_id ?? null,
      subcategoryValues: product.subcategory_values || {},
      featured: product.featured ?? false,
      published: product.published !== undefined ? product.published : true,
      stockQuantity: product.stock_quantity || 0,
      images: (imagesByProduct[product.id] || []), // nunca retorna null
      createdAt: product.created_at,
      updatedAt: product.updated_at,
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
