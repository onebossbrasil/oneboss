
import { useProducts } from "@/contexts/ProductContext";
import { useToast } from "@/hooks/use-toast";
import { brlStringToFloat } from "@/utils/product/price-utils";

export const useProductFormSubmission = () => {
  const { toast } = useToast();
  const { addProduct } = useProducts();

  const submitProduct = async (
    formData: any,
    selectedCategory: string,
    selectedSubcategoryId: string | null,
    selectedAttributeId: string | null,
    subcategoryValues: Record<string, string>,
    images: File[]
  ) => {
    // Utiliza função padronizada de conversão para float
    const price = brlStringToFloat(formData.price);
    
    // Convert sale price to a number if provided
    let salePrice = undefined;
    if (formData.salePrice) {
      salePrice = brlStringToFloat(formData.salePrice);
    }
    
    // Convert stock quantity to a number
    const stockQuantity = parseInt(formData.stockQuantity, 10);

    // Prepara os dados para cadastro incluindo os novos campos
    const productData = {
      name: formData.name,
      shortDescription: formData.shortDescription || null,
      description: formData.description,
      price,
      salePrice: salePrice || null,
      categoryId: selectedCategory,
      subcategoryId: selectedSubcategoryId ?? null,
      attributeId: selectedAttributeId ?? null,
      subcategoryValues,
      published: formData.published,
      featured: formData.featured,
      stockQuantity,
      images: [] // Will be added during creation
    };
    
    // Save product to Supabase
    await addProduct(productData, images);
  };

  return {
    submitProduct
  };
};
