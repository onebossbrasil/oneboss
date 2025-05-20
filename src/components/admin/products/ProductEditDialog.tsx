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
import { useEffect } from "react";

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

  // O productId sempre será o UUID correto do produto
  const productId = product?.id || null;
  const { product: freshProduct, isLoading } = useFetchProductById(productId, open);

  useEffect(() => {
    if (open && freshProduct) {
      console.log("[Modal] freshProduct carregado pós-update:", freshProduct);
    }
  }, [open, freshProduct]);

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
    handleSubmit,
    setSelectedCategory,
    setSubcategoryValues,
    setImages,
    setImagePreviewUrls,
    setDeletedImageIds,
    selectedSubcategoryId, // é o UUID vindo do banco
    selectedAttributeId,    // é o UUID do atributo
    handleAttributeChange,
    handleSubcatIdChange
  } = useProductEdit(freshProduct, handleDialogClose); // freshProduct já está atualizado

  useEffect(() => {
    if (open) {
      console.log("[Modal] OPEN: Produto recebido:", product);
      console.log("[Modal] Produto fresh do banco:", freshProduct);
      console.log("[Modal] Estado inicial:", {
        selectedCategory,
        subcategoryValues,
        images,
        imagePreviewUrls,
        formData
      });
    }
  }, [open, product, freshProduct, selectedCategory, subcategoryValues, images, imagePreviewUrls, formData]);

  useEffect(() => {
    if (!open) return;
    // Nada a fazer aqui; hook reidrata o produto fresh de qualquer forma
    // eslint-disable-next-line
  }, [open, productId]);

  useEffect(() => {
    if (!open) {
      setSelectedCategory("");
      setSubcategoryValues({});
      setImages([]);
      setImagePreviewUrls([]);
      setDeletedImageIds([]);
      console.log("[Modal] Fechando modal: Resetei todos os campos internos de edição!");
    }
    // eslint-disable-next-line
  }, [open]);

  const wrappedHandleSubmit = (e: React.FormEvent) => {
    console.log("[Modal] Submissão iniciada. Dados do formulário:", {
      formData,
      selectedCategory,
      subcategoryValues,
      images,
      imagePreviewUrls,
      selectedSubcategoryId,
      selectedAttributeId
    });
    handleSubmit(e);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen && onClose) onClose();
    }}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{freshProduct ? "Editar Produto" : "Cadastrar Produto"}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></span>
            <span className="ml-4 text-muted-foreground">Carregando dados do produto...</span>
          </div>
        ) : (
          <form onSubmit={wrappedHandleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <ProductDetailsForm 
                  formData={formData}
                  onChange={(field, value) => {
                    handleFormChange(field, value);
                  }}
                />
                <CategorySelector
                  selectedCategory={selectedCategory}
                  subcategoryValues={subcategoryValues}
                  selectedSubcategoryId={selectedSubcategoryId} // sempre o UUID do banco!
                  onCategoryChange={handleCategoryChange}
                  onSubcategoryChange={handleSubcategoryChange}
                  onSubcategoryIdChange={handleSubcatIdChange}
                  onAttributeIdChange={handleAttributeChange}
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
