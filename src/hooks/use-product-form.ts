
import { useProductFormState } from "./use-product-form-state";
import { useProductFormImages } from "./use-product-form-images";
import { useProductFormValidation } from "./use-product-form-validation";
import { useProductFormSubmission } from "./use-product-form-submission";
import { useToast } from "@/hooks/use-toast";

export const useProductForm = () => {
  const { toast } = useToast();
  
  const {
    formData,
    selectedCategory,
    selectedSubcategoryId,
    selectedAttributeId,
    subcategoryValues,
    isOpen,
    setIsOpen,
    handleFormChange,
    handleCategoryChange,
    handleSubcategoryChange,
    handleAttributeChange,
    resetForm
  } = useProductFormState();

  const {
    images,
    imagePreviewUrls,
    handleImageChange,
    handleRemoveImage,
    resetImages
  } = useProductFormImages();

  const { validateForm } = useProductFormValidation();
  const { submitProduct } = useProductFormSubmission();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!validateForm(formData, selectedCategory)) {
        return;
      }

      await submitProduct(
        formData,
        selectedCategory,
        selectedSubcategoryId,
        selectedAttributeId,
        subcategoryValues,
        images
      );

      // ADICIONADO: aguarda curto delay antes de fechar o modal para garantir exibição do toast
      setTimeout(() => {
        resetForm();
        resetImages();
        setIsOpen(false);
      }, 800); // 0.8 segundos para garantir visualização do toast pelo usuário
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Erro ao salvar produto",
        description: "Ocorreu um erro ao salvar o produto. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return {
    formData,
    images,
    imagePreviewUrls,
    selectedCategory,
    selectedSubcategoryId,
    selectedAttributeId,
    subcategoryValues,
    isOpen,
    setIsOpen,
    handleFormChange,
    handleImageChange,
    handleRemoveImage,
    handleCategoryChange,
    handleSubcategoryChange,
    handleAttributeChange,
    handleSubmit
  };
};
