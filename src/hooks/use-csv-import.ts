
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCategories } from "@/contexts/CategoryContext";
import { ImportedProduct } from "@/types/csv";
import { mapRowsToProducts, validateProducts } from "@/utils/csvUtils";
import { useFileProcessing } from "@/hooks/use-file-processing";
import { batchImportProducts } from "@/utils/importUtils";

export const useCsvImport = () => {
  const { toast } = useToast();
  const { categories } = useCategories();
  
  const {
    file,
    imageFile,
    parsedData,
    headers,
    mapping,
    setMapping,
    handleCsvUpload,
    handleImageUpload,
    resetFiles
  } = useFileProcessing();
  
  const [previewMode, setPreviewMode] = useState(false);
  const [importedProducts, setImportedProducts] = useState<ImportedProduct[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

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
      const { successCount, errorCount } = await batchImportProducts(importedProducts, categories);
      
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
    resetFiles();
    setPreviewMode(false);
    setImportedProducts([]);
    setSuccess(false);
    setErrors([]);
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
