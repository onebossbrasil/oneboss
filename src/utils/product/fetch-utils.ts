import { Product, ProductImage } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";
import { createProductSlug } from "@/utils/slugUtils";

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
          image.url.trim() !== '' &&
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
      // Mostrando como será o array images no console
      console.log("[fetch-utils] Produto montado:", product.name, product.id, mappedImgs);

      return {
        id: product.id,
        name: product.name,
        slug: createProductSlug(product.name, product.id), // Gera slug automaticamente
        shortDescription: product.short_description || '',
        description: product.description || '',
        price: product.price_on_request ? null : (product.price ? parseFloat(product.price) : null),
        salePrice: product.sale_price ? parseFloat(product.sale_price) : null,
        categoryId: product.category_id,
        subcategoryId: product.subcategory_id ?? null,
        attributeId: product.attribute_id ?? null,
        subcategoryValues: {}, // Campo removido do banco, sempre vazio
        featured: product.featured ?? false,
        published: product.published !== undefined ? product.published : true,
        stockQuantity: product.stock_quantity || 0,
        images: Array.isArray(mappedImgs) ? mappedImgs : [], // SAFE!
        createdAt: product.created_at,
        updatedAt: product.updated_at,
        priceOnRequest: !!product.price_on_request,
      };
    });

    // LOG: Array final de produtos com imagens
    console.log("[fetch-utils] formattedProducts:", formattedProducts);

    return { products: formattedProducts, error: null };
  } catch (err: any) {
    console.error('Error fetching products:', err);
    
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

export interface FetchProductsPageParams {
  page: number;
  pageSize: number;
  search?: string;
  categoryId?: string;
  subcategoryIds?: string[];
  attributeIds?: string[];
  status?: "published" | "unpublished" | "";
}

export const fetchProductsPageFromSupabase = async (
  params: FetchProductsPageParams
): Promise<{ products: Product[]; totalCount: number; error: string | null }> => {
  try {
    const { 
      page, 
      pageSize, 
      search = "", 
      categoryId = "", 
      subcategoryIds = [], 
      attributeIds = [], 
      status = "" 
    } = params;
    const offset = (page - 1) * pageSize;
    
    console.log("[fetchProductsPageFromSupabase] Parâmetros recebidos:", {
      page, pageSize, search, categoryId, subcategoryIds, attributeIds, status, offset
    });

    // Base query com contagem
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .order('name', { ascending: true });

    // Filtros server-side
    if (search.trim()) {
      console.log("[fetchProductsPageFromSupabase] Aplicando filtro de busca:", search.trim());
      // Busca no nome, descrição curta e descrição
      query = query.or(`name.ilike.%${search.trim()}%,short_description.ilike.%${search.trim()}%,description.ilike.%${search.trim()}%`);
    }
    if (categoryId) {
      console.log("[fetchProductsPageFromSupabase] Aplicando filtro de categoria:", categoryId);
      query = query.eq('category_id', categoryId);
    }
    if (subcategoryIds.length > 0) {
      console.log("[fetchProductsPageFromSupabase] Aplicando filtro de subcategorias:", subcategoryIds);
      query = query.in('subcategory_id', subcategoryIds);
    }
    if (attributeIds.length > 0) {
      console.log("[fetchProductsPageFromSupabase] Aplicando filtro de atributos:", attributeIds);
      query = query.in('attribute_id', attributeIds);
    }
    if (status === 'published') {
      console.log("[fetchProductsPageFromSupabase] Aplicando filtro published = true");
      query = query.eq('published', true);
    } else if (status === 'unpublished') {
      console.log("[fetchProductsPageFromSupabase] Aplicando filtro published = false");
      query = query.eq('published', false);
    }

    // Paginação
    query = query.range(offset, offset + pageSize - 1);
    console.log("[fetchProductsPageFromSupabase] Aplicando paginação:", { offset, limit: offset + pageSize - 1 });

    const productsResult = await fetchWithTimeout(Promise.resolve(query));
    if (productsResult.error) throw productsResult.error;

    const rows: any[] = Array.isArray(productsResult.data) ? productsResult.data : [];
    const totalCount: number = (productsResult as any).count ?? rows.length;
    
    console.log("[fetchProductsPageFromSupabase] Resultado da query:", {
      produtos_retornados: rows.length,
      totalCount: totalCount,
      count_property: (productsResult as any).count
    });

    // Buscar imagens apenas dos produtos desta página
    const productIds = rows.map((r: any) => r.id).filter(Boolean);
    let imagesByProduct: Record<string, ProductImage[]> = {};
    if (productIds.length > 0) {
      const imagesPromise = supabase
        .from('product_images')
        .select('*')
        .in('product_id', productIds)
        .order('sort_order', { ascending: true });
      const imagesResult = await fetchWithTimeout(Promise.resolve(imagesPromise));
      if (imagesResult.error) throw imagesResult.error;
      imagesByProduct = {};
      if (imagesResult.data && Array.isArray(imagesResult.data)) {
        imagesResult.data.forEach((image: any) => {
          if (!image.product_id || !image.url) return;
          if (!imagesByProduct[image.product_id]) {
            imagesByProduct[image.product_id] = [];
          }
          if (
            typeof image.url === 'string' &&
            image.url.trim() !== '' &&
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
    }

    const formatted: Product[] = rows.map((product: any) => {
      const mappedImgs = imagesByProduct[product.id] || [];
      const priceOnRequest = product.price_on_request === true;
      return {
        id: product.id,
        name: product.name,
        slug: createProductSlug(product.name, product.id), // Gera slug automaticamente
        shortDescription: product.short_description || '',
        description: product.description || '',
        price: priceOnRequest ? null : (product.price ? parseFloat(product.price) : null),
        salePrice: priceOnRequest ? null : (product.sale_price ? parseFloat(product.sale_price) : null),
        categoryId: product.category_id,
        subcategoryId: product.subcategory_id ?? null,
        attributeId: product.attribute_id ?? null,
        subcategoryValues: {}, // Campo removido do banco, sempre vazio
        featured: product.featured ?? false,
        published: product.published !== undefined ? product.published : true,
        stockQuantity: product.stock_quantity || 0,
        images: Array.isArray(mappedImgs) ? mappedImgs : [],
        createdAt: product.created_at,
        updatedAt: product.updated_at,
        priceOnRequest,
      } as Product;
    });

    return { products: formatted, totalCount, error: null };
  } catch (err: any) {
    console.error('[fetchProductsPageFromSupabase] Error:', err);
    const message = err?.message || 'Erro ao buscar produtos.';
    return { products: [], totalCount: 0, error: message };
  }
};

