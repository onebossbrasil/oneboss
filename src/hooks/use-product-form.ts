import { useState } from "react";
import { useProducts } from "@/contexts/ProductContext";
import { useToast } from "@/hooks/use-toast";

export const useProductForm = () => {
  const { toast } = useToast();
  const { addProduct } = useProducts();
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategoryValues, setSubcategoryValues] = useState<Record<string, string>>({});
  const [isOpen, setIsOpen] = useState(false);
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
    // Remove image and its preview
    const newImages = [...images];
    const newPreviewUrls = [...imagePreviewUrls];
    
    // Revoke the URL to free memory
    URL.revokeObjectURL(newPreviewUrls[index]);
    
    newImages.splice(index, 1);
    newPreviewUrls.splice(index, 1);
    
    setImages(newImages);
    setImagePreviewUrls(newPreviewUrls);
  };
  
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    // Keep the featured status but reset other subcategory values
    const featured = subcategoryValues.featured;
    setSubcategoryValues(featured ? { featured } : {});
  };
  
  const handleSubcategoryChange = (type: string, value: string) => {
    setSubcategoryValues(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleFormChange = (field: string, value: any) => {
    if (field === 'featured') {
      setFormData(prev => ({ ...prev, [field]: value }));
      handleSubcategoryChange('featured', value.toString());
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validar categoria como campo obrigatório (deve ser UUID, já que category_id agora é NOT NULL FK)
      if (!formData.name || !formData.price || !selectedCategory) {
        toast({
          title: "Erro no formulário",
          description: "Por favor, preencha todos os campos obrigatórios.",
          variant: "destructive"
        });
        return;
      }

      // Validar: selectedCategory deve ser um UUID válido!
      // Verifica se é um uuid simples (cuidado: não permite category_id ser um 'value' não UUID)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(selectedCategory)) {
        toast({
          title: "Categoria inválida",
          description: "Selecione uma categoria válida.",
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

      // Prepara os dados, repassando categoryId como uuid:
      const productData = {
        name: formData.name,
        shortDescription: formData.shortDescription || null,
        description: formData.description,
        price,
        salePrice: salePrice || null,
        categoryId: selectedCategory, // AGORA sempre uuid
        subcategoryValues,
        published: formData.published,
        featured: formData.featured,
        stockQuantity,
        images: [] // Will be added during creation
      };
      
      // Save product to Supabase
      await addProduct(productData, images);

      // ADICIONADO: aguarda curto delay antes de fechar o modal para garantir exibição do toast
      setTimeout(() => {
        setFormData({
          name: "",
          shortDescription: "",
          description: "",
          price: "",
          salePrice: "",
          stockQuantity: "1",
          published: true,
          featured: false
        });
        setSelectedCategory("");
        setSubcategoryValues({});
        setImages([]);
        setImagePreviewUrls([]);
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
    subcategoryValues,
    isOpen,
    setIsOpen,
    handleFormChange,
    handleImageChange,
    handleRemoveImage,
    handleCategoryChange,
    handleSubcategoryChange,
    handleSubmit
  };
};
