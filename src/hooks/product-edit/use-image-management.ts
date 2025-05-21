import { useState, useEffect } from "react";
import { Product, ProductImage } from "@/types/product";

export const useImageManagement = (product: Product | null) => {
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);

  useEffect(() => {
    if (product?.images) {
      // Agora SEMPRE traz todas imagens do banco para o preview (sem fatiar)
      setImagePreviewUrls(product.images.map(img => img.url));
      setImages([]); // Limpa uploads novos
      setDeletedImageIds([]);
      console.log("[useImageManagement] Imagens fresh do produto:", product.images.length, product.images);
    } else {
      setImagePreviewUrls([]);
      setImages([]);
      setDeletedImageIds([]);
      console.log("[useImageManagement] Resetou imagens (novo produto ou sem produto)");
    }
  }, [product?.id, product?.images?.length]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      // Evita duplicidade
      const uniqueNewFiles = newFiles.filter(newFile =>
        !images.some(existing => existing.name === newFile.name && existing.size === newFile.size)
      );
      const newPreviewUrls = uniqueNewFiles.map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...uniqueNewFiles]);
      setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
      console.log("[useImageManagement] Imagens novas adicionadas:", uniqueNewFiles.map(f => f.name));
    }
  };

  const handleRemoveImage = (index: number) => {
    if (product && index < (product.images?.length ?? 0)) {
      // Remove imagem do banco
      const imageToDelete = product.images[index];
      setDeletedImageIds(prev => [...prev, imageToDelete.id]);
      // Remove do preview (mantém ordem)
      const newPreviewUrls = [...imagePreviewUrls];
      newPreviewUrls.splice(index, 1);
      setImagePreviewUrls(newPreviewUrls);
      console.log("[useImageManagement] Marcou imagem BD p/ deleção", imageToDelete.id);
    } else {
      // Imagem nova ainda não persistida
      const newImageIndex = index - (product?.images?.length ?? 0);
      const newImages = [...images];
      const previewUrl = imagePreviewUrls[index];
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      newImages.splice(newImageIndex, 1);
      const newPreviewUrls = [...imagePreviewUrls];
      newPreviewUrls.splice(index, 1);
      setImages(newImages);
      setImagePreviewUrls(newPreviewUrls);
      console.log("[useImageManagement] Removeu imagem local, restantes:", newPreviewUrls.length);
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
