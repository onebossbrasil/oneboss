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
import { useFetchProductById } from "@/hooks/use-fetch-product-by-id";

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

  // Se o produto vier da listagem, vamos buscar do banco ao abrir.
  const productId = product?.id || null;
  const { product: freshProduct, isLoading } = useFetchProductById(productId, open);

  // Só monta o hook do formulário quando o dado está carregado
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
  } = useProductEdit(freshProduct, handleDialogClose);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen && onClose) onClose();
    }}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></span>
            <span className="ml-4 text-muted-foreground">Carregando dados do produto...</span>
          </div>
        ) : (
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
                  existingImages={freshProduct?.images || []}
                />
              </div>
            </div>

            <ProductEditActions 
              onCancel={handleDialogClose} 
              isSubmitting={isSubmitting} 
            />
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductEditDialog;
