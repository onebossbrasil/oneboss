
import { useToast } from "@/hooks/use-toast";

export const useFormValidation = () => {
  const { toast } = useToast();

  const validateProductData = (
    name: string, 
    price: string, 
    salePrice: string, 
    stockQuantity: string,
    selectedCategory: string
  ) => {
    // Validate required fields
    if (!name || !price || !selectedCategory) {
      toast({
        title: "Erro no formulário",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return false;
    }
    
    // Convert price to a number
    const numericPrice = parseFloat(price.replace(/[^\d,.-]/g, '').replace(',', '.'));
    if (isNaN(numericPrice)) {
      toast({
        title: "Preço inválido",
        description: "Por favor, insira um preço válido.",
        variant: "destructive"
      });
      return false;
    }
    
    // Convert sale price to a number if provided
    if (salePrice) {
      const numericSalePrice = parseFloat(salePrice.replace(/[^\d,.-]/g, '').replace(',', '.'));
      if (isNaN(numericSalePrice)) {
        toast({
          title: "Preço promocional inválido",
          description: "Por favor, insira um preço promocional válido.",
          variant: "destructive"
        });
        return false;
      }
    }
    
    // Convert stock quantity to a number
    const numericStockQuantity = parseInt(stockQuantity, 10);
    if (isNaN(numericStockQuantity)) {
      toast({
        title: "Quantidade inválida",
        description: "Por favor, insira uma quantidade válida.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  // Helper to convert string price to number
  const convertPriceToNumber = (priceString: string) => {
    return parseFloat(priceString.replace(/[^\d,.-]/g, '').replace(',', '.'));
  };

  return {
    validateProductData,
    convertPriceToNumber,
  };
};
