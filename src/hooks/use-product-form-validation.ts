
import { useToast } from "@/hooks/use-toast";
import { brlStringToFloat } from "@/utils/product/price-utils";

export const useProductFormValidation = () => {
  const { toast } = useToast();

  const validateForm = (formData: any, selectedCategory: string) => {
    // Validar categoria como campo obrigatório (deve ser UUID, já que category_id agora é NOT NULL FK)
    if (!formData.name || !formData.price || !selectedCategory) {
      toast({
        title: "Erro no formulário",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return false;
    }

    // Validar: selectedCategory deve ser um UUID válido!
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(selectedCategory)) {
      toast({
        title: "Categoria inválida",
        description: "Selecione uma categoria válida.",
        variant: "destructive"
      });
      return false;
    }
    
    // Utiliza função padronizada de conversão para float
    const price = brlStringToFloat(formData.price);
    if (isNaN(price)) {
      toast({
        title: "Preço inválido",
        description: "Por favor, insira um preço válido.",
        variant: "destructive"
      });
      return false;
    }
    
    // Convert sale price to a number if provided
    if (formData.salePrice) {
      const salePrice = brlStringToFloat(formData.salePrice);
      if (isNaN(salePrice)) {
        toast({
          title: "Preço promocional inválido",
          description: "Por favor, insira um preço promocional válido.",
          variant: "destructive"
        });
        return false;
      }
    }
    
    // Convert stock quantity to a number
    const stockQuantity = parseInt(formData.stockQuantity, 10);
    if (isNaN(stockQuantity)) {
      toast({
        title: "Quantidade inválida",
        description: "Por favor, insira uma quantidade válida.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  return {
    validateForm
  };
};
