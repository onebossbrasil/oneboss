
import { useState, useEffect } from "react";
import { useProducts } from "@/contexts/ProductContext";
import { Product, ProductImage } from "@/types/product";
import { useToast } from "@/hooks/use-toast";

export const useProductEdit = (
  product: Product | null,
  onClose: () => void
) => {
  const { updateProduct } = useProducts();
  const { toast } = useToast();
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategoryValues, setSubcategoryValues] = useState<Record<string, string>>({});
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    description: "",
    price: "",
    salePrice: "",
    stockQuantity: "1",
    published: true,
    featured: false
  });

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        shortDescription: product.shortDescription || "",
        description: product.description,
        price: product.price.toString(),
        salePrice: product.salePrice ? product.salePrice.toString() : "",
        stockQuantity: product.stockQuantity.toString(),
        published: product.published,
        featured: product.featured
      });
      setSelectedCategory(product.categoryId || "");
      setSubcategoryValues(product.subcategoryValues || {});
      setImagePreviewUrls(product.images.map(img => img.url));
      setImages([]);
      setDeletedImageIds([]); // Reset deleted image IDs
    }
  }, [product]);

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSubcategoryValues({});
  };
  
  const handleSubcategoryChange = (type: string, value: string) => {
    setSubcategoryValues(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // Create preview URLs
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      
      setImages(prev => [...prev, ...newFiles]);
      setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };
  
  const handleRemoveImage = (index: number) => {
    if (!product) return;

    // Check if this is an existing image from the database
    if (index < product.images.length) {
      const imageToDelete = product.images[index];
      setDeletedImageIds(prev => [...prev, imageToDelete.id]);
      
      // Remove from preview URLs
      const newPreviewUrls = [...imagePreviewUrls];
      newPreviewUrls.splice(index, 1);
      setImagePreviewUrls(newPreviewUrls);
    } else {
      // This is a newly added image
      const newImageIndex = index - product.images.length;
      
      // Remove from images array
      const newImages = [...images];
      newImages.splice(newImageIndex, 1);
      setImages(newImages);
      
      // Revoke URL to free memory
      URL.revokeObjectURL(imagePreviewUrls[index]);
      
      // Remove from preview URLs
      const newPreviewUrls = [...imagePreviewUrls];
      newPreviewUrls.splice(index, 1);
      setImagePreviewUrls(newPreviewUrls);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product) return;
    
    try {
      // Validate form data
      if (!formData.name || !formData.price || !selectedCategory) {
        toast({
          title: "Erro no formulário",
          description: "Por favor, preencha todos os campos obrigatórios.",
          variant: "destructive"
        });
        return;
      }
      
      // Convert price to a number
      const price = parseFloat(formData.price.replace(/[^\d,.-]/g, '').replace(',', '.'));
      if (isNaN(price)) {
        toast({
          title: "Preço inválido",
          description: "Por favor, insira um preço válido.",
          variant: "destructive"
        });
        return;
      }
      
      // Convert sale price to a number if provided
      let salePrice = undefined;
      if (formData.salePrice) {
        salePrice = parseFloat(formData.salePrice.replace(/[^\d,.-]/g, '').replace(',', '.'));
        if (isNaN(salePrice)) {
          toast({
            title: "Preço promocional inválido",
            description: "Por favor, insira um preço promocional válido.",
            variant: "destructive"
          });
          return;
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
        return;
      }

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
      
      // Update product
      await updateProduct(product.id, productData, images.length > 0 ? images : undefined);
      
      // Close dialog
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Erro ao atualizar produto",
        description: "Ocorreu um erro ao atualizar o produto. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return {
    formData,
    selectedCategory,
    subcategoryValues,
    images,
    imagePreviewUrls,
    handleFormChange,
    handleCategoryChange,
    handleSubcategoryChange,
    handleImageChange,
    handleRemoveImage,
    handleUpdateProduct
  };
};
