export type ProductImage = {
  id: string;
  url: string;
  sortOrder: number;
};

export type Product = {
  id: string;
  name: string;
  slug?: string; // Slug URL-amigável gerado do nome
  shortDescription?: string;
  description: string;
  price: number | null;
  salePrice?: number | null;
  categoryId: string | null;
  // NOVOS CAMPOS RELACIONADOS COM IDs
  subcategoryId?: string | null;
  attributeId?: string | null;
  published: boolean;
  featured: boolean;
  stockQuantity: number;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
  // NOVO CAMPO: Sob Consulta
  priceOnRequest?: boolean;
};

export type FormattedProduct = {
  id: string;
  slug?: string; // Slug URL-amigável
  name: string;
  price: number | null;
  salePrice?: number | null;
  category: string;
  subcategory?: string;
  imageUrl: string;
  featured: boolean;
  description?: string;
  priceOnRequest?: boolean;
};
