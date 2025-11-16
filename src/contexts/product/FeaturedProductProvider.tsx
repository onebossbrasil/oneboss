import React, { createContext, useContext, useEffect, useMemo, useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductImage } from "@/types/product";

interface FeaturedProductContextType {
  featuredProducts: Product[];
  isLoading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
}

const FeaturedProductContext = createContext<FeaturedProductContextType | undefined>(undefined);

// Optimized function to fetch only featured products from database
const fetchFeaturedProductsOptimized = async (): Promise<{ products: Product[], error: string | null }> => {
  try {
    console.log("[FeaturedProductProvider] Buscando APENAS produtos em destaque do banco");

    // Busca apenas produtos featured=true AND published=true
    const productsPromise = supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .eq('published', true)
      .order('name', { ascending: true });
    
    const productsResult = await Promise.resolve(productsPromise);

    if (productsResult.error) {
      console.error("[FeaturedProductProvider] Erro ao buscar produtos em destaque:", productsResult.error);
      throw productsResult.error;
    }

    const featuredProducts = productsResult.data || [];
    console.log("[FeaturedProductProvider] Produtos em destaque encontrados no banco:", featuredProducts.length);

    if (featuredProducts.length === 0) {
      return { products: [], error: null };
    }

    // Buscar imagens apenas dos produtos em destaque
    const productIds = featuredProducts.map((p: any) => p.id);
    const imagesPromise = supabase
      .from('product_images')
      .select('*')
      .in('product_id', productIds)
      .order('sort_order', { ascending: true });
    
    const imagesResult = await Promise.resolve(imagesPromise);
    if (imagesResult.error) throw imagesResult.error;

    console.log("[FeaturedProductProvider] Imagens carregadas para produtos em destaque:", imagesResult.data?.length || 0);

    // Mapear imagens para produtos
    const imagesByProduct: Record<string, ProductImage[]> = {};
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

    // Formatar produtos
    const formattedProducts: Product[] = featuredProducts.map((product: any) => {
      const mappedImgs = imagesByProduct[product.id] || [];
      return {
        id: product.id,
        name: product.name,
        shortDescription: product.short_description || '',
        description: product.description || '',
        price: product.price_on_request ? null : (product.price ? parseFloat(product.price) : null),
        salePrice: product.sale_price ? parseFloat(product.sale_price) : null,
        categoryId: product.category_id,
        subcategoryId: product.subcategory_id ?? null,
        attributeId: product.attribute_id ?? null,
        subcategoryValues: {},
        featured: product.featured ?? false,
        published: product.published !== undefined ? product.published : true,
        stockQuantity: product.stock_quantity || 0,
        images: Array.isArray(mappedImgs) ? mappedImgs : [],
        createdAt: product.created_at,
        updatedAt: product.updated_at,
        priceOnRequest: !!product.price_on_request,
      };
    });

    console.log("[FeaturedProductProvider] Produtos em destaque formatados:", formattedProducts.length);
    return { products: formattedProducts, error: null };
  } catch (err: any) {
    console.error('[FeaturedProductProvider] Erro ao buscar produtos em destaque:', err);
    const errorMessage = err.message || 'Erro desconhecido ao buscar produtos em destaque.';
    return { products: [], error: errorMessage };
  }
};

export const FeaturedProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const resp = await fetchFeaturedProductsOptimized();
      
      if (resp.error) {
        console.error("[FeaturedProductProvider] Erro:", resp.error);
        throw new Error(resp.error);
      }

      console.log("[FeaturedProductProvider] Produtos em destaque carregados:", resp.products.length);
      setProducts(resp.products);
    } catch (err: any) {
      console.error('[FeaturedProductProvider] Falha ao carregar produtos em destaque:', err);
      setError(err.message || 'Falha ao conectar com o banco de dados');
      toast({
        title: 'Erro ao carregar produtos em destaque',
        description: err.message || 'Falha ao conectar com o banco de dados',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Carregamento inicial apenas quando o provider é montado
  useEffect(() => {
    console.log("[FeaturedProductProvider] Inicializando carregamento de produtos em destaque");
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  const refreshProducts = useCallback(async () => {
    console.log("[FeaturedProductProvider] Refresh manual solicitado");
    await fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  const contextValue = useMemo(() => ({
    featuredProducts: products,
    isLoading,
    error,
    refreshProducts
  }), [products, isLoading, error, refreshProducts]);

  console.log("FeaturedProductProvider rendering with", products.length, "featured products");

  return (
    <FeaturedProductContext.Provider value={contextValue}>
      {children}
    </FeaturedProductContext.Provider>
  );
};

export const useFeaturedProducts = () => {
  const context = useContext(FeaturedProductContext);
  if (context === undefined) {
    throw new Error("useFeaturedProducts must be used within a FeaturedProductProvider");
  }
  return context;
};