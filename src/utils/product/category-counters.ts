import { supabase } from "@/integrations/supabase/client";

export interface CategoryCounter {
  categoryId: string;
  count: number;
}

export interface SubcategoryCounter {
  subcategoryId: string;
  count: number;
}

export interface AttributeCounter {
  attributeId: string;
  count: number;
}

// Busca contadores de todas as categorias
export const fetchCategoryCounters = async (): Promise<{ 
  categoryCounters: CategoryCounter[], 
  error: string | null 
}> => {
  try {
    console.log("[CategoryCounters] Buscando contadores de categorias...");
    
    const { data, error } = await supabase
      .from('products')
      .select('category_id')
      .eq('published', true); // Apenas produtos publicados

    if (error) throw error;

    // Agrupa e conta por categoria
    const categoryCounters: CategoryCounter[] = [];
    const countMap: Record<string, number> = {};

    data.forEach(product => {
      if (product.category_id) {
        countMap[product.category_id] = (countMap[product.category_id] || 0) + 1;
      }
    });

    Object.entries(countMap).forEach(([categoryId, count]) => {
      categoryCounters.push({ categoryId, count });
    });

    console.log("[CategoryCounters] Contadores de categorias obtidos:", categoryCounters);
    return { categoryCounters, error: null };
    
  } catch (err: any) {
    console.error('[CategoryCounters] Erro ao buscar contadores:', err);
    return { categoryCounters: [], error: err.message };
  }
};

// Busca contadores de subcategorias para uma categoria específica
export const fetchSubcategoryCounters = async (categoryId: string): Promise<{ 
  subcategoryCounters: SubcategoryCounter[], 
  error: string | null 
}> => {
  try {
    console.log("[CategoryCounters] Buscando contadores de subcategorias para categoria:", categoryId);
    
    const { data, error } = await supabase
      .from('products')
      .select('subcategory_id')
      .eq('category_id', categoryId)
      .eq('published', true)
      .not('subcategory_id', 'is', null); // Apenas produtos com subcategoria

    if (error) throw error;

    // Agrupa e conta por subcategoria
    const subcategoryCounters: SubcategoryCounter[] = [];
    const countMap: Record<string, number> = {};

    data.forEach(product => {
      if (product.subcategory_id) {
        countMap[product.subcategory_id] = (countMap[product.subcategory_id] || 0) + 1;
      }
    });

    Object.entries(countMap).forEach(([subcategoryId, count]) => {
      subcategoryCounters.push({ subcategoryId, count });
    });

    console.log("[CategoryCounters] Contadores de subcategorias obtidos:", subcategoryCounters);
    return { subcategoryCounters, error: null };
    
  } catch (err: any) {
    console.error('[CategoryCounters] Erro ao buscar contadores de subcategorias:', err);
    return { subcategoryCounters: [], error: err.message };
  }
};

// Busca contadores de atributos para uma subcategoria específica
export const fetchAttributeCounters = async (subcategoryId: string): Promise<{ 
  attributeCounters: AttributeCounter[], 
  error: string | null 
}> => {
  try {
    console.log("[CategoryCounters] Buscando contadores de atributos para subcategoria:", subcategoryId);
    
    const { data, error } = await supabase
      .from('products')
      .select('attribute_id')
      .eq('subcategory_id', subcategoryId)
      .eq('published', true)
      .not('attribute_id', 'is', null); // Apenas produtos com atributo

    if (error) throw error;

    // Agrupa e conta por atributo
    const attributeCounters: AttributeCounter[] = [];
    const countMap: Record<string, number> = {};

    data.forEach(product => {
      if (product.attribute_id) {
        countMap[product.attribute_id] = (countMap[product.attribute_id] || 0) + 1;
      }
    });

    Object.entries(countMap).forEach(([attributeId, count]) => {
      attributeCounters.push({ attributeId, count });
    });

    console.log("[CategoryCounters] Dados brutos da query:", data);
    console.log("[CategoryCounters] Contadores de atributos obtidos:", attributeCounters);
    return { attributeCounters, error: null };
    
  } catch (err: any) {
    console.error('[CategoryCounters] Erro ao buscar contadores de atributos:', err);
    return { attributeCounters: [], error: err.message };
  }
};