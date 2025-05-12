
import CollapsibleProductForm from "./products/CollapsibleProductForm";
import { useProductForm } from "@/hooks/use-product-form";

const ProductForm = () => {
  const {
    formData,
    images,
    imagePreviewUrls,
    selectedCategory,
    subcategoryValues,
    isOpen,
    setIsOpen,
    handleFormChange,
    handleImageChange,
    handleRemoveImage,
    handleCategoryChange,
    handleSubcategoryChange,
    handleSubmit
  } = useProductForm();
  
  return (
    <CollapsibleProductForm 
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      formData={formData}
      handleFormChange={handleFormChange}
      selectedCategory={selectedCategory}
      subcategoryValues={subcategoryValues}
      onCategoryChange={handleCategoryChange}
      onSubcategoryChange={handleSubcategoryChange}
      images={images}
      imagePreviewUrls={imagePreviewUrls}
      handleImageChange={handleImageChange}
      handleRemoveImage={handleRemoveImage}
      handleSubmit={handleSubmit}
    />
  );
};

export default ProductForm;
