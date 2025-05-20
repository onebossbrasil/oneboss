
import { useState, useEffect } from "react";
import { Product } from "@/types/product";

// Permite reidratação do formData ao mudar produto
export const useFormState = (product: Product | null) => {
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

  // Sempre que o produto fresh chegar, RESETA o formulário
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        shortDescription: product.shortDescription || "",
        description: product.description,
        price: product.price.toString(),
        salePrice: product.salePrice ? product.salePrice.toString() : "",
        stockQuantity: product.stockQuantity.toString(),
        published: product.published,
        featured: product.featured
      });
      console.log("[useFormState] Formulário reidratado com produto fresh:", product.name);
    }
  }, [product]);

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    handleFormChange,
    setFormData // exportado se quiser resetar manualmente no futuro
  };
};
