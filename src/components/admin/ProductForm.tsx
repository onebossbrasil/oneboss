
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import ProductDetailsForm from "./products/ProductDetailsForm";
import CategorySelector from "./products/CategorySelector";
import ImageUpload from "./products/ImageUpload";

const ProductForm = () => {
  const { toast } = useToast();
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategoryValues, setSubcategoryValues] = useState<Record<string, string>>({});
  
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // This would normally save to a database
    toast({
      title: "Produto adicionado com sucesso",
      description: "O produto foi cadastrado e já está disponível na loja.",
    });
    
    // Reset form
    setImages([]);
    setImagePreviewUrls([]);
    setSelectedCategory("");
    setSubcategoryValues({});
    
    // Reset the form elements
    const form = e.target as HTMLFormElement;
    form.reset();
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <ProductDetailsForm />
              
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
