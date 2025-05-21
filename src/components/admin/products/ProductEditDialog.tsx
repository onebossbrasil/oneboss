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

  const productId = product?.id || null;
  const { product: freshProduct, isLoading } = useFetchProductById(productId, open);

  useEffect(() => {
    if (open) {
      console.log("[Diagnóstico Modal] Produto do banco:", freshProduct);
      console.log("[Diagnóstico Modal] Produto prop:", product);
    }
  }, [open, freshProduct, product]);

  const {
    formData,
    selectedCategory,
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
    setImages,
    setImagePreviewUrls,
    setDeletedImageIds,
    selectedSubcategoryId,
    selectedAttributeId,
    handleAttributeChange,
    handleSubcatIdChange
  } = useProductEdit(freshProduct, handleDialogClose);

  useEffect(() => {
    if (open) {
      console.log("[Diagnóstico Modal] Comparação Category: product?.categoryId =", product?.categoryId, "| freshProduct?.categoryId =", freshProduct?.categoryId, "| selectedCategory =", selectedCategory);
    }
  }, [open, product, freshProduct, selectedCategory]);

  useEffect(() => {
    if (open && freshProduct?.categoryId && freshProduct.categoryId !== selectedCategory) {
      console.log("[Diagnóstico Modal] Corrigindo selectedCategory para UUID do banco:", freshProduct.categoryId);
      setSelectedCategory(freshProduct.categoryId);
    }
    // eslint-disable-next-line
  }, [open, freshProduct?.categoryId]);

  useEffect(() => {
    if (!open) {
      setSelectedCategory("");
      setImages([]);
      setImagePreviewUrls([]);
      setDeletedImageIds([]);
      console.log("[Modal] Fechando modal: Reset campos internos de edição!");
    }
    // eslint-disable-next-line
  }, [open]);

  const wrappedHandleSubmit = (e: React.FormEvent) => {
    console.log("[Modal] Submissão iniciada. Dados do formulário:", {
      formData,
      selectedCategory,
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
          <>
            <form onSubmit={wrappedHandleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <ProductDetailsForm 
                    formData={formData}
                    onChange={(field, value) => {
                      handleFormChange(field, value);
                    }}
                  />
                  <div>
                    <span style={{fontSize:10, color:"#6c6"}}>[DEBUG: selectedCategory = {selectedCategory}]</span>
                  </div>
                  <CategorySelector
                    selectedCategory={selectedCategory}
                    subcategoryValues={{}} // não usar mais subcategoryValues da API
                    selectedSubcategoryId={selectedSubcategoryId}
                    onCategoryChange={handleCategoryChange}
                    onSubcategoryChange={() => {}}
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductEditDialog;
