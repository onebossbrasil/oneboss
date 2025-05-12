
import { Product } from "@/types/product";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProductDetailsForm from "./ProductDetailsForm";
import CategorySelector from "./CategorySelector";
import ImageUpload from "./ImageUpload";
import ProductEditActions from "./edit/ProductEditActions";
import { useProductEdit } from "@/hooks/use-product-edit";

interface ProductEditDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose?: () => void;
}

const ProductEditDialog = ({ product, open, onOpenChange, onClose }: ProductEditDialogProps) => {
  const handleDialogClose = () => {
    onOpenChange(false);
    onClose?.();
  };
  
  const {
    formData,
    selectedCategory,
    subcategoryValues,
    images,
    imagePreviewUrls,
    isSubmitting,
    handleFormChange,
    handleCategoryChange,
    handleSubcategoryChange,
    handleImageChange,
    handleRemoveImage,
    handleUpdateProduct
  } = useProductEdit(product, handleDialogClose);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen && onClose) onClose();
    }}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleUpdateProduct} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <ProductDetailsForm 
                formData={formData}
                onChange={handleFormChange}
              />
              
              <CategorySelector
                selectedCategory={selectedCategory}
                subcategoryValues={subcategoryValues}
                onCategoryChange={handleCategoryChange}
                onSubcategoryChange={handleSubcategoryChange}
              />
            </div>
            
            <div className="space-y-4">
              <ImageUpload
                images={images}
                imagePreviewUrls={imagePreviewUrls}
                handleImageChange={handleImageChange}
                handleRemoveImage={handleRemoveImage}
                existingImages={product?.images || []}
              />
            </div>
          </div>
          
          <ProductEditActions 
            onCancel={handleDialogClose} 
            isSubmitting={isSubmitting} 
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductEditDialog;
