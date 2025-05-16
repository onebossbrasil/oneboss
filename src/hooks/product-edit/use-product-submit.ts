
import { useState } from "react";
import { useProducts } from "@/contexts/ProductContext";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
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

export const useProductSubmit = (
  product: Product | null,
  formData: ProductFormData,
  selectedCategory: string,
  subcategoryValues: Record<string, string>,
  images: File[],
  deletedImageIds: string[],
  onSuccess: () => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateProduct } = useProducts();
  const { toast } = useToast();
  const { validateProductData, convertPriceToNumber } = useFormValidation();

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("EditSubmit: handleUpdateProduct chamado."); // Diagnóstico

    if (!product) {
      toast({
        title: "Nenhum produto selecionado",
        description: "Não foi possível encontrar o produto para atualização.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      setIsSubmitting(true);

      // Validate form data
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

      // Convert price to a number
      const price = convertPriceToNumber(formData.price);

      // Convert sale price to a number if provided
      let salePrice = undefined;
      if (formData.salePrice) {
        salePrice = convertPriceToNumber(formData.salePrice);
      }

      // Convert stock quantity to a number
      const stockQuantity = parseInt(formData.stockQuantity, 10);

      // Prepare product data
      const productData = {
        name: formData.name,
        shortDescription: formData.shortDescription || null,
        description: formData.description,
        price,
        salePrice: salePrice || null,
        categoryId: selectedCategory,
        subcategoryValues,
        published: formData.published,
        featured: formData.featured,
        stockQuantity,
        deletedImageIds: deletedImageIds // Pass the deleted image IDs to updateProduct
      };

      console.log("EditSubmit: enviando productData", productData);

      // Update product
      await updateProduct(product.id, productData, images.length > 0 ? images : undefined);

      // Feedback de sucesso
      toast({
        title: "Produto atualizado",
        description: "As alterações foram salvas com sucesso!",
        variant: "default"
      });

      // Close dialog
      onSuccess();
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Erro ao atualizar produto",
        description: "Ocorreu um erro ao atualizar o produto. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleUpdateProduct
  };
};
