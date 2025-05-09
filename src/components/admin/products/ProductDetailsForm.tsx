
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface ProductDetailsFormProps {
  formData: {
    name: string;
    description: string;
    price: string;
    stockQuantity: string;
    featured: boolean;
  };
  onChange: (field: string, value: any) => void;
}

const ProductDetailsForm = ({ formData, onChange }: ProductDetailsFormProps) => {
  const handleNumberInput = (field: string, value: string) => {
    // Allow only numbers and standard price formatting
    if (field === 'price') {
      // Format as currency
      const numericValue = value.replace(/[^\d]/g, '');
      if (numericValue === '') {
        onChange(field, '');
        return;
      }
      
      const floatValue = parseInt(numericValue, 10) / 100;
      const formattedValue = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(floatValue);
      
      onChange(field, formattedValue);
    } else if (field === 'stockQuantity') {
      // Only allow positive integers
      const numericValue = value.replace(/[^\d]/g, '');
      onChange(field, numericValue);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Produto</Label>
        <Input
          id="name"
          placeholder="Nome do produto"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          placeholder="Descrição detalhada do produto"
          className="min-h-[120px]"
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Preço</Label>
          <Input
            id="price"
            placeholder="R$ 0,00"
            value={formData.price}
            onChange={(e) => handleNumberInput("price", e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="stockQuantity">Quantidade em Estoque</Label>
          <Input
            id="stockQuantity"
            type="text"
            placeholder="0"
            value={formData.stockQuantity}
            onChange={(e) => handleNumberInput("stockQuantity", e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="featured"
          checked={formData.featured}
          onCheckedChange={(checked) => onChange("featured", checked)}
        />
        <Label htmlFor="featured">Destaque na página inicial</Label>
      </div>
    </div>
  );
};

export default ProductDetailsForm;
