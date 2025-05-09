
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import ProductDetailsForm from "./products/ProductDetailsForm";
import CategorySelector from "./products/CategorySelector";
import ImageUpload from "./products/ImageUpload";
import { useProducts } from "@/contexts/ProductContext";

const ProductForm = () => {
  const { toast } = useToast();
  const { addProduct } = useProducts();
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategoryValues, setSubcategoryValues] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "1",
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
    setSubcategoryValues({});
  };
  
  const handleSubcategoryChange = (type: string, value: string) => {
    setSubcategoryValues(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
        description: formData.description,
        price,
        categoryId: selectedCategory,
        subcategoryValues,
        featured: formData.featured,
        stockQuantity,
        images: [] // Will be added during creation
      };
      
      // Save product to Supabase
      await addProduct(productData, images);
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        stockQuantity: "1",
        featured: false
      });
      setSelectedCategory("");
      setSubcategoryValues({});
      setImages([]);
      setImagePreviewUrls([]);
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Erro ao salvar produto",
        description: "Ocorreu um erro ao salvar o produto. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <ProductDetailsForm 
                formData={formData}
                onChange={handleFormChange}
              />
              
              <CategorySelector
                selectedCategory={selectedCategory}
                subcategoryValues={subcategoryValues}
                onCategoryChange={handleCategoryChange}
                onSubcategoryChange={handleSubcategoryChange}
              />
            </div>
            
            <div className="space-y-4">
              <ImageUpload
                images={images}
                imagePreviewUrls={imagePreviewUrls}
                handleImageChange={handleImageChange}
                handleRemoveImage={handleRemoveImage}
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full md:w-auto">
            <Upload className="mr-2 h-4 w-4" />
            Cadastrar Produto
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
