import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCategories } from "@/contexts/CategoryContext";
import { ImportedProduct, ParsedCsvRow } from "@/types/csv";

export const useCsvImport = () => {
  const { toast } = useToast();
  const { categories } = useCategories();
  
  const [file, setFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedCsvRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [previewMode, setPreviewMode] = useState(false);
  const [importedProducts, setImportedProducts] = useState<ImportedProduct[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreviewMode(false);
    setSuccess(false);
    setErrors([]);
    
    if (e.target.files && e.target.files[0]) {
      const csvFile = e.target.files[0];
      setFile(csvFile);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          try {
            const csvData = event.target.result;
            const lines = csvData.split('\n');
            const headers = lines[0].split(',').map(h => h.trim());
            setHeaders(headers);
            
            // Initialize mapping to suggested defaults
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
            setMapping(initialMapping);
            
            // Parse rows
            const rows = lines.slice(1).filter(line => line.trim() !== '').map(line => {
              const values = line.split(',').map(v => v.trim());
              const row: Record<string, string> = {};
              headers.forEach((header, index) => {
                row[header] = values[index] || '';
              });
              return row;
            });
            
            setParsedData(rows);
            
          } catch (error) {
            setErrors(['Erro ao analisar o arquivo CSV. Verifique o formato.']);
          }
        }
      };
      reader.readAsText(csvFile);
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };
  
  const validateProducts = (products: ImportedProduct[]): string[] => {
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
  
  const previewImport = () => {
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
    
    const validationErrors = validateProducts(products);
    setErrors(validationErrors);
    setImportedProducts(products.filter((_, index) => {
      return !validationErrors.some(error => error.includes(`Linha ${index + 2}:`));
    }));
    setPreviewMode(true);
  };
  
  const processImport = async () => {
    if (importedProducts.length === 0) {
      setErrors(['Nenhum produto válido para importar']);
      return;
    }
    
    setIsImporting(true);
    
    try {
      // Process each product
      let successCount = 0;
      let errorCount = 0;
      
      for (const product of importedProducts) {
        try {
          // Find category ID
          const categoryObj = categories.find(c => 
            c.name.toLowerCase() === product.category.toLowerCase()
          );
          
          // Parse price - convert string to number
          const priceStr = product.price.replace(/[^\d.,]/g, '').replace(',', '.');
          const price = parseFloat(priceStr);
          
          if (!categoryObj || isNaN(price)) {
            errorCount++;
            continue;
          }
          
          // Parse subcategories if present
          const subcategoryValues: Record<string, string> = {};
          if (product.subcategories) {
            const subcatEntries = product.subcategories.split(';');
            subcatEntries.forEach(entry => {
              const [type, value] = entry.split(':');
              if (type && value) {
                subcategoryValues[type.trim()] = value.trim();
              }
            });
          }
          
          // Insert product into Supabase
          const { data: newProduct, error } = await supabase
            .from('products')
            .insert({
              name: product.name,
              description: product.description,
              price,
              category_id: categoryObj.id.toString(),
              subcategory_values: subcategoryValues,
              featured: product.featured,
              stock_quantity: product.stockQuantity
            })
            .select()
            .single();
            
          if (error) throw error;
          
          // Insert images if any
          if (product.images.length > 0) {
            const imageInserts = product.images.map((imageUrl, index) => ({
              product_id: newProduct.id,
              url: imageUrl,
              sort_order: index
            }));
            
            const { error: imageError } = await supabase
              .from('product_images')
              .insert(imageInserts);
              
            if (imageError) throw imageError;
          }
          
          successCount++;
        } catch (err) {
          console.error(`Error importing product:`, err);
          errorCount++;
        }
      }
      
      toast({
        title: `Importação concluída`,
        description: `${successCount} produtos importados com sucesso. ${errorCount} falhas.`,
      });
      
      setSuccess(true);
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Erro na importação",
        description: "Ocorreu um erro ao importar os produtos.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };
  
  const resetForm = () => {
    setFile(null);
    setImageFile(null);
    setParsedData([]);
    setHeaders([]);
    setMapping({});
    setPreviewMode(false);
    setImportedProducts([]);
    setSuccess(false);
  };

  return {
    file,
    imageFile,
    headers,
    mapping,
    setMapping,
    parsedData,
    previewMode,
    setPreviewMode,
    importedProducts,
    errors,
    success,
    isImporting,
    handleCsvUpload,
    handleImageUpload,
    previewImport,
    processImport,
    resetForm
  };
};
