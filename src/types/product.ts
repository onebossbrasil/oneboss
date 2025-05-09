
export type ProductImage = {
  id: string;
  url: string;
  sortOrder: number;
};

export type Product = {
  id: string;
  name: string;
  shortDescription?: string;
  description: string;
  price: number;
  salePrice?: number | null;
  categoryId: string | null;
  subcategoryValues: Record<string, string>;
  published: boolean;
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
