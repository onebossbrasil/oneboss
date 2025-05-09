
export interface ParsedCsvRow {
  [key: string]: string;
}

export interface ImportedProduct {
  name: string;
  price: string;
  description: string;
  category: string;
  subcategories?: string;
  featured: boolean;
  images: string[];
  stockQuantity: number;
}
