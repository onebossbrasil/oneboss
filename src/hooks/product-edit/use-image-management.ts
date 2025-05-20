import { useState, useEffect } from "react";
import { Product, ProductImage } from "@/types/product";

export const useImageManagement = (product: Product | null) => {
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);

  // Reset images when product changes ou após update bem sucedido
  useEffect(() => {
    if (product) {
      setImagePreviewUrls(product.images.map(img => img.url));
      setImages([]);
      setDeletedImageIds([]); // Reset deleted image IDs
      console.log("[useImageManagement] Carregando imagens fresh do produto:", product.images);
    } else {
      setImagePreviewUrls([]);
      setImages([]);
      setDeletedImageIds([]);
      console.log("[useImageManagement] Resetou imagens (novo produto)");
    }
  }, [product]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);

      // Filtra arquivos já existentes por nome para evitar duplicata
      const uniqueNewFiles = newFiles.filter(newFile => (
        !images.some(existing => existing.name === newFile.name && existing.size === newFile.size)
      ));

      // Create preview URLs
      const newPreviewUrls = uniqueNewFiles.map(file => URL.createObjectURL(file));

      setImages(prev => [...prev, ...uniqueNewFiles]);
      setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);

      console.log("[useImageManagement] Imagens novas adicionadas:", uniqueNewFiles.map(f => f.name), "Total previews:", newPreviewUrls);
    }
  };

  const handleRemoveImage = (index: number) => {
    if (product && index < product.images.length) {
      // Remove imagem existente, guarda id para deleção
      const imageToDelete = product.images[index];
      setDeletedImageIds(prev => [...prev, imageToDelete.id]);
      // Remove do preview também
      const newPreviewUrls = [...imagePreviewUrls];
      newPreviewUrls.splice(index, 1);
      setImagePreviewUrls(newPreviewUrls);
      console.log("[useImageManagement] Marcou imagem para deleção (no banco)", imageToDelete.id, "deletedImageIds agora:", [...deletedImageIds, imageToDelete.id]);
    } else {
      // Nova imagem (ainda não foi enviada ao banco)
      const newImageIndex = index - (product?.images?.length ?? 0);
      const newImages = [...images];
      const newImagePreview = imagePreviewUrls[index];
      if (newImagePreview) URL.revokeObjectURL(newImagePreview);
      newImages.splice(newImageIndex, 1);
      const newPreviewUrls = [...imagePreviewUrls];
      newPreviewUrls.splice(index, 1);
      setImages(newImages);
      setImagePreviewUrls(newPreviewUrls);
      console.log("[useImageManagement] Removeu nova imagem local, previews restantes:", newPreviewUrls.length);
    }
  };

  return {
    images,
    imagePreviewUrls,
    deletedImageIds,
    handleImageChange,
    handleRemoveImage,
    setImages,
    setImagePreviewUrls,
    setDeletedImageIds
  };
};
