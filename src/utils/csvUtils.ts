
import { ImportedProduct, ParsedCsvRow } from "@/types/csv";

/**
 * Parses CSV data into rows and headers
 */
export const parseCSVData = (csvData: string): { 
  headers: string[]; 
  rows: ParsedCsvRow[] 
} => {
  try {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    // Parse rows
    const rows = lines.slice(1)
      .filter(line => line.trim() !== '')
      .map(line => {
        const values = line.split(',').map(v => v.trim());
        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      });
    
    return { headers, rows };
  } catch (error) {
    console.error("Error parsing CSV data:", error);
    return { headers: [], rows: [] };
  }
};

/**
 * Creates initial field mapping based on CSV headers
 */
export const createInitialMapping = (headers: string[]): Record<string, string> => {
  const initialMapping: Record<string, string> = {};
  
  headers.forEach(header => {
    const lowerHeader = header.toLowerCase();
    if (lowerHeader.includes('nome') || lowerHeader.includes('name')) initialMapping[header] = 'name';
    else if (lowerHeader.includes('preço') || lowerHeader.includes('price')) initialMapping[header] = 'price';
    else if (lowerHeader.includes('desc')) initialMapping[header] = 'description';
    else if (lowerHeader.includes('categ')) initialMapping[header] = 'category';
    else if (lowerHeader.includes('subcateg')) initialMapping[header] = 'subcategories';
    else if (lowerHeader.includes('destaque') || lowerHeader.includes('featured')) initialMapping[header] = 'featured';
    else if (lowerHeader.includes('imag') || lowerHeader.includes('image')) initialMapping[header] = 'images';
    else if (lowerHeader.includes('estoque') || lowerHeader.includes('stock')) initialMapping[header] = 'stockQuantity';
  });
  
  return initialMapping;
};

/**
 * Maps parsed CSV data to product objects based on field mapping
 */
export const mapRowsToProducts = (parsedData: ParsedCsvRow[], mapping: Record<string, string>): ImportedProduct[] => {
  const products: ImportedProduct[] = [];
  
  parsedData.forEach(row => {
    try {
      const product: ImportedProduct = {
        name: '',
        price: '',
        description: '',
        category: '',
        subcategories: '',
        featured: false,
        images: [],
        stockQuantity: 0
      };
      
      // Map fields according to user's mapping
      Object.entries(mapping).forEach(([csvHeader, productField]) => {
        if (productField === 'name') product.name = row[csvHeader];
        else if (productField === 'price') product.price = row[csvHeader];
        else if (productField === 'description') product.description = row[csvHeader];
        else if (productField === 'category') product.category = row[csvHeader];
        else if (productField === 'subcategories') product.subcategories = row[csvHeader];
        else if (productField === 'featured') product.featured = row[csvHeader]?.toLowerCase() === 'sim' || row[csvHeader]?.toLowerCase() === 'true';
        else if (productField === 'images') {
          const imageUrls = row[csvHeader]?.split('|').filter(url => url.trim() !== '');
          product.images = imageUrls || [];
        }
        else if (productField === 'stockQuantity') {
          product.stockQuantity = parseInt(row[csvHeader], 10) || 0;
        }
      });
      
      products.push(product);
    } catch (error) {
      console.error("Error processing row:", error);
    }
  });
  
  return products;
};

/**
 * Validates product data for required fields and data integrity
 */
export const validateProducts = (products: ImportedProduct[], categories: Array<{ name: string; id: string }>): string[] => {
  const validationErrors: string[] = [];
  
  products.forEach((product, index) => {
    if (!product.name) {
      validationErrors.push(`Linha ${index + 2}: Nome do produto é obrigatório`);
    }
    
    if (!product.price) {
      validationErrors.push(`Linha ${index + 2}: Preço do produto é obrigatório`);
    }
    
    if (product.category && !categories.some(c => c.name.toLowerCase() === product.category.toLowerCase())) {
      validationErrors.push(`Linha ${index + 2}: Categoria "${product.category}" não encontrada`);
    }
  });
  
  return validationErrors;
};
