
export interface ParsedCsvRow {
  [key: string]: string;
}

export interface ImportedProduct {
  name: string;
  price: string;
  shortDescription?: string;
  description: string;
  salePrice?: string;
  category: string;
  subcategories?: string;
  featured: boolean;
  published: boolean;
  images: string[];
  stockQuantity: number;
}
