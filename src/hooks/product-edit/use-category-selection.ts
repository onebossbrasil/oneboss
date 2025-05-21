import { Product } from "@/types/product";

// Remover uso de subcategoryValues
export function useCategorySelection(product: Product) {
  // Altere para não usar subcategoryValues
  const categoryId = product.categoryId || null;
  const subcategoryId = product.subcategoryId || null;
  const attributeId = product.attributeId || null;

  return {
    categoryId,
    subcategoryId,
    attributeId,
  };
}
