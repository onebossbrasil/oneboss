
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

      // Logs de depuração de categoria/subcategoria
      console.log("[Diagnóstico Edição] Produto sendo editado:", product.id);
      console.log("[Diagnóstico Edição] selectedCategory (esperado UUID):", selectedCategory);
      console.log("[Diagnóstico Edição] subcategoryValues:", subcategoryValues);

      // Validate form fields
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

      // Validação adicional: se subcategoryValues for necessária, impedir submit vazio
      // Se a categoria requer subcategoria (tem ao menos um campo) e não foi escolhida, impedir envio
      // Regra: se existir categoria selecionada, e ela tem subcategorias, deve ter pelo menos 1 par chave:valor preenchido
      // Para isso usamos length das chaves
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

      // Convert price to number
      const price = convertPriceToNumber(formData.price);

      // Sale price to number, if any
      let salePrice = undefined;
      if (formData.salePrice) {
        salePrice = convertPriceToNumber(formData.salePrice);
      }

      const stockQuantity = parseInt(formData.stockQuantity, 10);

      // Monta dados: só envia subcategoryValues se não estiver vazio; senão, envia null explicitamente
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
        stockQuantity,
        deletedImageIds: deletedImageIds
      };

      console.log("[Diagnóstico Edição] ENVIANDO PARA updateProduct:", {
        id: product.id,
        ...productData,
        imagesLength: images?.length
      });

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
