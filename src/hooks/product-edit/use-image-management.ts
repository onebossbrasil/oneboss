import { useState, useEffect } from "react";
import { Product, ProductImage } from "@/types/product";

export const useImageManagement = (product: Product | null) => {
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);

  // Sempre reseta previews e deletes ao receber um novo produto fresh (após fetch atualizado)
  useEffect(() => {
    if (product?.images) {
      setImagePreviewUrls(product.images.map(img => img.url));
      setImages([]); // Limpa uploads pendentes, só mostra já salvas!
      setDeletedImageIds([]); // Limpa a lista de imagens a excluir
      console.log("[useImageManagement] Carregando imagens fresh do produto:", product.images);
    } else {
      setImagePreviewUrls([]);
      setImages([]);
      setDeletedImageIds([]);
      console.log("[useImageManagement] Resetou imagens (novo produto ou sem produto)");
    }
  }, [product?.id, product?.images?.length]); // now use product id and image count as dep

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      // Evitar duplicidade apenas entre imagens novas (mas pode reenviar imagem igual se user precisar)
      const uniqueNewFiles = newFiles.filter(newFile => (
        !images.some(existing => existing.name === newFile.name && existing.size === newFile.size)
      ));

      const newPreviewUrls = uniqueNewFiles.map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...uniqueNewFiles]);
      setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
      console.log("[useImageManagement] Imagens novas adicionadas:", uniqueNewFiles.map(f => f.name));
    }
  };

  const handleRemoveImage = (index: number) => {
    if (product && index < (product.images?.length ?? 0)) {
      // Remover imagem existente (index responde ao array imagePreviewUrls, que é sempre [imagens-db,...imagens-uploadadas])
      const imageToDelete = product.images[index];
      setDeletedImageIds(prev => [...prev, imageToDelete.id]);
      // Remove do preview e mantém ordem das novas/antigas
      const newPreviewUrls = [...imagePreviewUrls];
      newPreviewUrls.splice(index, 1);
      setImagePreviewUrls(newPreviewUrls);
      console.log("[useImageManagement] Marcou imagem BD para deleção", imageToDelete.id);
    } else {
      // Nova imagem enviada nesta sessão (ainda não foi persistida)
      const newImageIndex = index - (product?.images?.length ?? 0);
      const newImages = [...images];
      const previewUrl = imagePreviewUrls[index];
      if (previewUrl) URL.revokeObjectURL(previewUrl);
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
