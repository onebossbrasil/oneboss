
import { useState } from "react";
import { useProducts } from "@/contexts/ProductContext";
import { useToast } from "@/hooks/use-toast";
import { useFormValidation } from "./use-form-validation";

interface ProductFormData {
  name: string;
  shortDescription: string;
  description: string;
  price: string;
  salePrice: string;
  stockQuantity: string;
  published: boolean;
  featured: boolean;
}

export const useProductAdd = (
  formData: ProductFormData,
  selectedCategory: string,
  subcategoryValues: Record<string, string>,
  images: File[],
  onSuccess: () => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addProduct } = useProducts();
  const { toast } = useToast();
  const { validateProductData, convertPriceToNumber } = useFormValidation();

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    // Validação básica da categoria
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!selectedCategory || !uuidRegex.test(selectedCategory)) {
      setIsSubmitting(false);
      toast({
        title: "Categoria inválida",
        description: "Selecione uma categoria válida.",
        variant: "destructive"
      });
      return;
    }

    // Validação subcategoria obrigatória: se categoria foi selecionada (sempre é, pois é obrigatória), 
    // e subcategoryValues é vazio, barrar submit
    if (
      selectedCategory &&
      Array.isArray(Object.keys(subcategoryValues)) &&
      Object.keys(subcategoryValues).length === 0
    ) {
      setIsSubmitting(false);
      toast({
        title: "Subcategoria obrigatória",
        description: "Selecione ao menos uma subcategoria/atributo antes de salvar.",
        variant: "destructive"
      });
      return;
    }

    // Validate the rest of the form
    const isValid = validateProductData(
      formData.name,
      formData.price,
      formData.salePrice,
      formData.stockQuantity,
      selectedCategory
    );

    if (!isValid) {
      setIsSubmitting(false);
      toast({
        title: "Erro de validação",
        description: "Verifique os campos obrigatórios e tente novamente.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Convert price to number
      const price = convertPriceToNumber(formData.price);

      let salePrice = undefined;
      if (formData.salePrice) {
        salePrice = convertPriceToNumber(formData.salePrice);
      }

      const stockQuantity = parseInt(formData.stockQuantity, 10);

      // Enviar subcategoryValues apenas se não estiver vazio; senão, envia null explicitamente
      const productData = {
        name: formData.name,
        shortDescription: formData.shortDescription || null,
        description: formData.description,
        price,
        salePrice: salePrice || null,
        categoryId: selectedCategory,
        subcategoryValues: Object.keys(subcategoryValues).length > 0 ? subcategoryValues : null,
        published: formData.published,
        featured: formData.featured,
        stockQuantity
      };

      await addProduct(productData, images);

      toast({
        title: "Produto cadastrado!",
        description: "O produto foi adicionado com sucesso.",
        variant: "default"
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Erro ao cadastrar produto",
        description: "Ocorreu um erro ao salvar o produto. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleAddProduct
  };
};
