
import React from "react";
import { Input } from "@/components/ui/input";
import FormField from "./FormField";

interface PriceFieldsProps {
  price: string;
  salePrice: string;
  onPriceChange: (value: string) => void;
  onSalePriceChange: (value: string) => void;
}

const PriceFields: React.FC<PriceFieldsProps> = ({
  price,
  salePrice,
  onPriceChange,
  onSalePriceChange,
}) => {
  const handleNumberInput = (field: string, value: string, onChange: (value: string) => void) => {
    // Allow only numbers and standard price formatting
    const numericValue = value.replace(/[^\d]/g, '');
    if (numericValue === '') {
      onChange('');
      return;
    }
    
    const floatValue = parseInt(numericValue, 10) / 100;
    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(floatValue);
    
    onChange(formattedValue);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField id="price" label="Preço Normal">
        <Input
          id="price"
          placeholder="R$ 0,00"
          value={price}
          onChange={(e) => handleNumberInput("price", e.target.value, onPriceChange)}
          required
        />
      </FormField>
      
      <FormField id="salePrice" label="Preço Promocional">
        <Input
          id="salePrice"
          placeholder="R$ 0,00"
          value={salePrice}
          onChange={(e) => handleNumberInput("salePrice", e.target.value, onSalePriceChange)}
        />
      </FormField>
    </div>
  );
};

export default PriceFields;
