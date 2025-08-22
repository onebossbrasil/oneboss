import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FormField from "./form/FormField";
import PriceFields from "./form/PriceFields";
import ToggleFields from "./form/ToggleFields";

interface ProductDetailsFormProps {
  formData: {
    name: string;
    shortDescription: string;
    description: string;
    price: string;
    salePrice: string;
    stockQuantity: string;
    published: boolean;
    featured: boolean;
    priceOnRequest?: boolean;
  };
  onChange: (field: string, value: any) => void;
}

const ProductDetailsForm: React.FC<ProductDetailsFormProps> = ({ formData, onChange }) => {
  const handleStockQuantityInput = (value: string) => {
    // Only allow positive integers
    const numericValue = value.replace(/[^\d]/g, '');
    onChange("stockQuantity", numericValue);
  };

  return (
    <div className="space-y-4">
      <FormField id="name" label="Nome do Produto">
        <Input
          id="name"
          placeholder="Nome do produto"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          required
        />
      </FormField>
      
      <FormField id="shortDescription" label="Descrição Curta">
        <Input
          id="shortDescription"
          placeholder="Breve descrição do produto"
          value={formData.shortDescription}
          onChange={(e) => onChange("shortDescription", e.target.value)}
        />
      </FormField>
      
      <FormField id="description" label="Descrição Longa">
        <Textarea
          id="description"
          placeholder="Descrição detalhada do produto"
          className="min-h-[120px]"
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </FormField>
      
      <PriceFields 
        price={formData.price} 
        salePrice={formData.salePrice}
        priceOnRequest={formData.priceOnRequest || false}
        onPriceChange={(value) => onChange("price", value)}
        onSalePriceChange={(value) => onChange("salePrice", value)}
        onPriceOnRequestChange={(checked) => onChange("priceOnRequest", checked)}
      />
      
      <FormField id="stockQuantity" label="Quantidade em Estoque">
        <Input
          id="stockQuantity"
          type="text"
          placeholder="0"
          value={formData.stockQuantity}
          onChange={(e) => handleStockQuantityInput(e.target.value)}
          required
        />
      </FormField>
      
      <ToggleFields 
        published={formData.published}
        featured={formData.featured}
        onPublishedChange={(checked) => onChange("published", checked)}
        onFeaturedChange={(checked) => onChange("featured", checked)}
      />
    </div>
  );
};

export default ProductDetailsForm;
