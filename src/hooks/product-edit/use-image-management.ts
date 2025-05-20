
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
    } else {
      setImagePreviewUrls([]);
      setImages([]);
      setDeletedImageIds([]);
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
    }
  };

  const handleRemoveImage = (index: number) => {
    // Remoção pode ser de imagem existente no banco OU nova imagem
    if (product && index < product.images.length) {
      // Remove imagem existente, guarda id para deleção
      const imageToDelete = product.images[index];
      setDeletedImageIds(prev => [...prev, imageToDelete.id]);
      // Remove do preview também
      const newPreviewUrls = [...imagePreviewUrls];
      newPreviewUrls.splice(index, 1);
      setImagePreviewUrls(newPreviewUrls);
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
    }
  };

  return {
    images,
    imagePreviewUrls,
    deletedImageIds,
    handleImageChange,
    handleRemoveImage,
    setImages, // para permitir resetamento explícito
    setImagePreviewUrls,
    setDeletedImageIds
  };
};
