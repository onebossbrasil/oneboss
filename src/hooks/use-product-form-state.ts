
import { useState } from "react";

export const useProductFormState = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const [selectedAttributeId, setSelectedAttributeId] = useState<string | null>(null);
  const [subcategoryValues, setSubcategoryValues] = useState<Record<string, string>>({});
  const [isOpen, setIsOpen] = useState(false);
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

  const handleFormChange = (field: string, value: any) => {
    if (field === 'featured') {
      setFormData(prev => ({ ...prev, [field]: value }));
      setSubcategoryValues(prev => ({ ...prev, featured: value.toString() }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  // Mantém featured mas reseta subcategoria/atributo ao trocar categoria
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedSubcategoryId(null);
    setSelectedAttributeId(null);
    const featured = subcategoryValues.featured;
    setSubcategoryValues(featured ? { featured } : {});
  };

  const handleSubcategoryChange = (subcategoryId: string | null) => {
    setSelectedSubcategoryId(subcategoryId);
    // Também reseta atributo ao trocar a subcategoria
    setSelectedAttributeId(null);
  };

  const handleAttributeChange = (attributeId: string | null) => {
    setSelectedAttributeId(attributeId);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      shortDescription: "",
      description: "",
      price: "",
      salePrice: "",
      stockQuantity: "1",
      published: true,
      featured: false
    });
    setSelectedCategory("");
    setSelectedSubcategoryId(null);
    setSelectedAttributeId(null);
    setSubcategoryValues({});
  };

  return {
    formData,
    selectedCategory,
    selectedSubcategoryId,
    selectedAttributeId,
    subcategoryValues,
    isOpen,
    setIsOpen,
    handleFormChange,
    handleCategoryChange,
    handleSubcategoryChange,
    handleAttributeChange,
    resetForm,
    setSubcategoryValues
  };
};
