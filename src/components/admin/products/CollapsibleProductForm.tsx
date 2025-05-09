
import React from "react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Upload, ChevronDown, ChevronUp } from "lucide-react";
import ProductDetailsForm from "./ProductDetailsForm";
import CategorySelector from "./CategorySelector";
import ImageUpload from "./ImageUpload";
import ProductList from "./ProductList";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CollapsibleProductFormProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  formData: {
    name: string;
    shortDescription: string;
    description: string;
    price: string;
    salePrice: string;
    stockQuantity: string;
    published: boolean;
    featured: boolean;
  };
  handleFormChange: (field: string, value: any) => void;
  selectedCategory: string;
  subcategoryValues: Record<string, string>;
  onCategoryChange: (value: string) => void;
  onSubcategoryChange: (type: string, value: string) => void;
  images: File[];
  imagePreviewUrls: string[];
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

const CollapsibleProductForm: React.FC<CollapsibleProductFormProps> = ({
  isOpen,
  setIsOpen,
  formData,
  handleFormChange,
  selectedCategory,
  subcategoryValues,
  onCategoryChange,
  onSubcategoryChange,
  images,
  imagePreviewUrls,
  handleImageChange,
  handleRemoveImage,
  handleSubmit
}) => {
  return (
    <div className="space-y-6">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="border rounded-lg shadow-sm"
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex w-full justify-between p-4">
            <span className="text-lg font-medium">Cadastrar Novo Produto</span>
            {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
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
                    onCategoryChange={onCategoryChange}
                    onSubcategoryChange={onSubcategoryChange}
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
        </CollapsibleContent>
      </Collapsible>
      
      {/* Product List Component */}
      <ProductList />
    </div>
  );
};

export default CollapsibleProductForm;
