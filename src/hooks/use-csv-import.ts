
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCategories } from "@/contexts/CategoryContext";
import { ImportedProduct, ParsedCsvRow } from "@/types/csv";
import { parseCSVData, createInitialMapping, mapRowsToProducts, validateProducts } from "@/utils/csvUtils";

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
            const { headers, rows } = parseCSVData(event.target.result);
            setHeaders(headers);
            setParsedData(rows);
            setMapping(createInitialMapping(headers));
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
  
  const previewImport = () => {
    const products = mapRowsToProducts(parsedData, mapping);
    const validationErrors = validateProducts(products, categories);
    
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
