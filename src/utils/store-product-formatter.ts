import { Product } from "@/types/product";
import { CategoryType } from "@/types/category";

export function formatProductForGrid(product: Product, categories: CategoryType[]) {
  const categoryName = categories.find(cat => String(cat.id) === String(product.categoryId))?.name || "";
  const subcategory = categories
    .find(cat => String(cat.id) === String(product.categoryId))
    ?.subcategories?.find(sub => String(sub.id) === String(product.subcategoryId))
    ?.name || "";
  
  const imageUrl =
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600&h=400";
  
  const priceOnRequest = product.priceOnRequest === true;
  
  return {
    id: product.id,
    slug: product.slug, // Inclui o slug gerado
    name: product.name,
    price: priceOnRequest ? null : (product.price ?? null),
    salePrice: priceOnRequest ? null : (product.salePrice ?? null),
    category: categoryName,
    subcategory,
    imageUrl,
    featured: !!product.featured,
    description: product.shortDescription || product.description,
    priceOnRequest,
  };
}
