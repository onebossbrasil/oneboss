
export type ProductImage = {
  id: string;
  url: string;
  sortOrder: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string | null;
  subcategoryValues: Record<string, string>;
  featured: boolean;
  stockQuantity: number;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
};

export type FormattedProduct = {
  id: string;
  name: string;
  price: string;
  category: string;
  subcategory?: string;
  imageUrl: string;
  featured: boolean;
  description?: string;
};
