
import { Product } from "@/types/product";
import { CategoryType } from "@/types/category";

export function formatProductForGrid(product: Product, categories: CategoryType[]) {
  const categoryName = categories.find(cat => String(cat.id) === String(product.categoryId))?.name || "";
  
  let price: string;
  if (typeof product.price === "number") {
    price = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.price);
  } else if (typeof product.price === "string") {
    price = product.price;
  } else {
    price = "";
  }
  
  const imageUrl =
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600&h=400";
  
  return {
    id: product.id,
    name: product.name,
    price,
    salePrice:
      product.salePrice && typeof product.salePrice === "number"
        ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.salePrice)
        : undefined,
    category: categoryName,
    subcategory: "",
    imageUrl,
    featured: !!product.featured,
    description: product.shortDescription || product.description,
  };
}
