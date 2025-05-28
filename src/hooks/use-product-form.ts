import { useState } from "react";
import { useProducts } from "@/contexts/ProductContext";
import { useToast } from "@/hooks/use-toast";
import { brlStringToFloat } from "@/utils/product/price-utils";

export const useProductForm = () => {
  const { toast } = useToast();
  const { addProduct } = useProducts();
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const [selectedAttributeId, setSelectedAttributeId] = useState<string | null>(null);
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

      // Remove duplicatas: bloquear arquivos com mesmo nome e tamanho já presentes
      const alreadyPresent = new Set(images.map(f => `${f.name}-${f.size}`));
      const trulyUniqueFiles = newFiles.filter(
        file => !alreadyPresent.has(`${file.name}-${file.size}`)
      );

      // Se não há arquivos novos, não atualiza nada
      if (trulyUniqueFiles.length === 0) return;

      // Cria preview só das imagens únicas
      const newPreviewUrls = trulyUniqueFiles.map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...trulyUniqueFiles]);
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
  
  // Mantém featured mas reseta subcategoria/atributo ao trocar categoria
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedSubcategoryId(null);
    setSelectedAttributeId(null);
    const featured = subcategoryValues.featured;
    setSubcategoryValues(featured ? { featured } : {});
  };
  
  const handleSubcategoryChange = (subcategoryId: string | null) => {
    setSelectedSubcategoryId(subcategoryId);
    // Também reseta atributo ao trocar a subcategoria
    setSelectedAttributeId(null);
  };

  const handleAttributeChange = (attributeId: string | null) => {
    setSelectedAttributeId(attributeId);
  };

  const handleFormChange = (field: string, value: any) => {
    if (field === 'featured') {
      setFormData(prev => ({ ...prev, [field]: value }));
      setSubcategoryValues(prev => ({ ...prev, featured: value.toString() }));
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
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(selectedCategory)) {
        toast({
          title: "Categoria inválida",
          description: "Selecione uma categoria válida.",
          variant: "destructive"
        });
        return;
      }
      
      // Utiliza função padronizada de conversão para float
      const price = brlStringToFloat(formData.price);
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
        salePrice = brlStringToFloat(formData.salePrice);
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
        setSelectedSubcategoryId(null);
        setSelectedAttributeId(null);
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
