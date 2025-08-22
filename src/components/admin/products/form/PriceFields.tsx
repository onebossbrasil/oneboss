import React from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import FormField from "./FormField";

interface PriceFieldsProps {
  price: string;
  salePrice: string;
  priceOnRequest?: boolean;
  onPriceChange: (value: string) => void;
  onSalePriceChange: (value: string) => void;
  onPriceOnRequestChange?: (checked: boolean) => void;
}

const PriceFields: React.FC<PriceFieldsProps> = ({
  price,
  salePrice,
  priceOnRequest = false,
  onPriceChange,
  onSalePriceChange,
  onPriceOnRequestChange,
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

  const handlePriceOnRequestChange = (checked: boolean) => {
    if (onPriceOnRequestChange) {
      onPriceOnRequestChange(checked);
      
      // Quando "Sob Consulta" é marcado, limpa os campos de preço
      if (checked) {
        onPriceChange('');
        onSalePriceChange('');
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Checkbox Sob Consulta */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="priceOnRequest"
          checked={priceOnRequest}
          onCheckedChange={handlePriceOnRequestChange}
        />
        <Label 
          htmlFor="priceOnRequest" 
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Sob Consulta
        </Label>
      </div>

      {/* Campos de Preço - Desabilitados quando "Sob Consulta" está marcado */}
      <div className="grid grid-cols-2 gap-4">
        <FormField id="price" label="Preço Normal">
          <Input
            id="price"
            placeholder="R$ 0,00"
            value={price}
            onChange={(e) => handleNumberInput("price", e.target.value, onPriceChange)}
            disabled={priceOnRequest}
            required={!priceOnRequest}
            className={priceOnRequest ? "bg-gray-100 text-gray-500" : ""}
          />
        </FormField>
        
        <FormField id="salePrice" label="Preço Promocional">
          <Input
            id="salePrice"
            placeholder="R$ 0,00"
            value={salePrice}
            onChange={(e) => handleNumberInput("salePrice", e.target.value, onSalePriceChange)}
            disabled={priceOnRequest}
            className={priceOnRequest ? "bg-gray-100 text-gray-500" : ""}
          />
        </FormField>
      </div>

      {/* Indicador visual quando "Sob Consulta" está ativo */}
      {priceOnRequest && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-sm text-blue-800 font-medium">
            ✓ Este produto será exibido como "Sob Consulta"
          </p>
        </div>
      )}
    </div>
  );
};

export default PriceFields;
