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
    featured: false,
    priceOnRequest: false
  });

  // Sempre que o produto fresh chegar, RESETA o formulário
  useEffect(() => {
    if (product) {
      // Log específico para AGUSTA
      if (product.name.includes("AGUSTA")) {
        console.log("[AGUSTA][useFormState] Dados brutos recebidos:", {
          id: product.id,
          name: product.name,
          price: product.price,
          priceOnRequest: product.priceOnRequest,
          salePrice: product.salePrice
        });
      }

      const priceOnRequest = product.priceOnRequest === true;
      
      const newFormData = {
        name: product.name,
        shortDescription: product.shortDescription || "",
        description: product.description,
        price: priceOnRequest ? "" : (product.price ? product.price.toString() : ""),
        salePrice: priceOnRequest ? "" : (product.salePrice ? product.salePrice.toString() : ""),
        stockQuantity: product.stockQuantity.toString(),
        published: product.published,
        featured: product.featured,
        priceOnRequest
      };

      // Log específico para AGUSTA
      if (product.name.includes("AGUSTA")) {
        console.log("[AGUSTA][useFormState] Formulário formatado:", newFormData);
      }

      setFormData(newFormData);
    }
  }, [product]);

  const handleFormChange = (field: string, value: any) => {
    // Log específico para AGUSTA
    if (formData.name.includes("AGUSTA")) {
      console.log("[AGUSTA][useFormState] Alteração de campo:", {
        campo: field,
        valorAntigo: formData[field as keyof typeof formData],
        valorNovo: value
      });
    }

    if (field === "priceOnRequest") {
      const newFormData = {
        ...formData,
        priceOnRequest: value,
        price: value ? "" : formData.price,
        salePrice: value ? "" : formData.salePrice
      };

      // Log específico para AGUSTA
      if (formData.name.includes("AGUSTA")) {
        console.log("[AGUSTA][useFormState] Formulário atualizado após priceOnRequest:", newFormData);
      }

      setFormData(newFormData);
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  return {
    formData,
    handleFormChange,
    setFormData
  };
};
