
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, Image } from "lucide-react";
import { useCategories } from "@/contexts/CategoryContext";

const ProductForm = () => {
  const { toast } = useToast();
  const { categories } = useCategories();
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategoryValues, setSubcategoryValues] = useState<Record<string, string>>({});
  
  // Get available subcategory types for the selected category
  const getSubcategoryTypes = () => {
    const category = categories.find(cat => cat.value === selectedCategory);
    return category ? category.subcategories.map(sc => sc.type) : [];
  };
  
  // Get available values for a specific subcategory type
  const getSubcategoryOptions = (subcatType: string) => {
    const category = categories.find(cat => cat.value === selectedCategory);
    if (!category) return [];
    
    const subcategory = category.subcategories.find(sc => sc.type === subcatType);
    return subcategory ? subcategory.values : [];
  };
  
  // Get the label of a subcategory type
  const getSubcategoryLabel = (subcatType: string) => {
    const category = categories.find(cat => cat.value === selectedCategory);
    if (!category) return subcatType.charAt(0).toUpperCase() + subcatType.slice(1);
    
    const subcategory = category.subcategories.find(sc => sc.type === subcatType);
    return subcategory ? subcategory.name : subcatType.charAt(0).toUpperCase() + subcatType.slice(1);
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
              <div>
                <Label htmlFor="name">Nome do Produto</Label>
                <Input id="name" placeholder="Ex: BMW X5 M Competition" required />
              </div>
              
              <div>
                <Label htmlFor="price">Preço</Label>
                <Input id="price" placeholder="Ex: R$ 850.000,00" required />
              </div>
              
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select onValueChange={handleCategoryChange} value={selectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedCategory && getSubcategoryTypes().map((subcatType) => (
                <div key={subcatType}>
                  <Label htmlFor={subcatType}>{getSubcategoryLabel(subcatType)}</Label>
                  <Select 
                    onValueChange={(value) => handleSubcategoryChange(subcatType, value)}
                    value={subcategoryValues[subcatType] || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Selecione ${getSubcategoryLabel(subcatType)}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {getSubcategoryOptions(subcatType).map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
              
              <div>
                <Label htmlFor="featured">Em Destaque?</Label>
                <Select defaultValue="false">
                  <SelectTrigger>
                    <SelectValue placeholder="O produto ficará em destaque?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Sim</SelectItem>
                    <SelectItem value="false">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Detalhes do produto..."
                  className="min-h-32"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="images">Imagens do Produto</Label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md">
                  <div className="space-y-1 text-center">
                    <Image className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-gold hover:text-gold-dark focus-within:outline-none">
                        <span>Fazer upload de imagens</span>
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          multiple
                          className="sr-only"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1">ou arraste e solte</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF até 10MB
                    </p>
                  </div>
                </div>
              </div>
              
              {imagePreviewUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={url} 
                        alt={`Preview ${index}`}
                        className="h-24 w-full object-cover rounded-md"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
