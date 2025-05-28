
import { useState, useEffect } from "react";
import { Product, ProductImage } from "@/types/product";

export const useImageManagement = (product: Product | null) => {
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (product?.images) {
      setImagePreviewUrls(product.images.map(img => img.url));
      setImages([]);
      setDeletedImageIds([]);
      setErrorMsg(null);
      console.log("[useImageManagement] Imagens fresh do produto:", product.images.length, product.images);
    } else {
      setImagePreviewUrls([]);
      setImages([]);
      setDeletedImageIds([]);
      setErrorMsg(null);
      console.log("[useImageManagement] Resetou imagens (novo produto ou sem produto)");
    }
  }, [product?.id, product?.images?.length]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    if (e.target.files) {
      const ALLOWED_TYPES = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp"
      ];
      const newFiles = Array.from(e.target.files);
      // Não aceita arquivos de tipo proibido
      const acceptedFiles = newFiles.filter(file => ALLOWED_TYPES.includes(file.type));
      const rejectedFiles = newFiles.filter(file => !ALLOWED_TYPES.includes(file.type));
      if (rejectedFiles.length > 0) {
        setErrorMsg("Formato inválido detectado. Apenas PNG, JPG, JPEG ou WEBP são suportados.");
        return;
      }
      // Evita duplicidade local (nome + size)
      const uniqueNewFiles = acceptedFiles.filter(newFile =>
        !images.some(
          existing => existing.name === newFile.name && existing.size === newFile.size
        )
      );
      // Também evita adicionar em sequência no mesmo upload
      const trulyUniqueFiles: File[] = [];
      const seen = new Set<string>();
      for (const file of uniqueNewFiles) {
        const key = `${file.name}-${file.size}`;
        if (!seen.has(key)) {
          trulyUniqueFiles.push(file);
          seen.add(key);
        }
      }

      const newPreviewUrls = trulyUniqueFiles.map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...trulyUniqueFiles]);
      setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
      console.log("[useImageManagement] Imagens novas adicionadas (sem duplicadas):", trulyUniqueFiles.map(f => f.name));
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
    setDeletedImageIds,
    errorMsg,
    setErrorMsg
  };
};

