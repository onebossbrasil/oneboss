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

    // Busca principal de produtos
    const productsPromise = supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true });
    const productsResult = await fetchWithTimeout(Promise.resolve(productsPromise));

    if (productsResult.error) {
      console.error("Error fetching products:", productsResult.error);
      throw productsResult.error;
    }

    // Busca todas imagens
    const imagesPromise = supabase
      .from('product_images')
      .select('*')
      .order('sort_order', { ascending: true }); // Garante todas e ordena
    const imagesResult = await fetchWithTimeout(Promise.resolve(imagesPromise));

    if (imagesResult.error) {
      console.error("Error fetching product images:", imagesResult.error);
      throw imagesResult.error;
    }

    // LOG para debug das imagens do banco
    console.log("[fetch-utils] product_images recebidas:", imagesResult.data?.length, imagesResult.data);

    // Mapeia todas imagens para products, garantindo sempre array válido
    const imagesByProduct: Record<string, ProductImage[]> = {};
    if (imagesResult.data && Array.isArray(imagesResult.data)) {
      imagesResult.data.forEach((image: any) => {
        if (!image.product_id || !image.url) return;
        if (!imagesByProduct[image.product_id]) {
          imagesByProduct[image.product_id] = [];
        }
        // Aqui, inclui toda url que seja string válida
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

    // LOG: exibir mapeamento final de imagens por produto
    console.log("[fetch-utils] imagesByProduct:", imagesByProduct);

    // Monta products incluindo sempre array de imagens (vazio se não houver)
    const formattedProducts: Product[] = productsResult.data.map((product: any) => {
      // LOG para cada produto e suas imagens mapeadas
      const mappedImgs = imagesByProduct[product.id] || [];
      console.log("[fetch-utils] Produto montado:", product.name, product.id, mappedImgs);

      return {
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
        images: mappedImgs, // array correto!
        createdAt: product.created_at,
        updatedAt: product.updated_at,
      };
    });

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
