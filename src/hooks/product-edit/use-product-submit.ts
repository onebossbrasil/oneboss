
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
  onSuccess: () => void,
  selectedSubcategoryId?: string | null,
  selectedAttributeId?: string | null,
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateProduct } = useProducts();
  const { toast } = useToast();
  const { validateProductData, convertPriceToNumber } = useFormValidation();

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

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

      // LOGs de diagnóstico

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

      // Agora subcategoria e atributo são opcionais.
      // Eles serão salvos apenas se passados (pode ser null)
      const price = convertPriceToNumber(formData.price);

      let salePrice = undefined;
      if (formData.salePrice) {
        salePrice = convertPriceToNumber(formData.salePrice);
      }

      const stockQuantity = parseInt(formData.stockQuantity, 10);

      const productData = {
        name: formData.name,
        shortDescription: formData.shortDescription || null,
        description: formData.description,
        price,
        salePrice: salePrice || null,
        categoryId: selectedCategory,
        subcategoryId: selectedSubcategoryId ?? null,
        attributeId: selectedAttributeId ?? null,
        subcategoryValues: Object.keys(subcategoryValues).length > 0 ? subcategoryValues : null,
        published: formData.published,
        featured: formData.featured,
        stockQuantity,
        deletedImageIds: deletedImageIds
      };

      await updateProduct(product.id, productData, images.length > 0 ? images : undefined);

      toast({
        title: "Produto atualizado",
        description: "As alterações foram salvas com sucesso!",
        variant: "default"
      });

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
