
import { useState } from "react";

export const useProductFormImages = () => {
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);

      // Remove duplicatas: bloquear arquivos com mesmo nome e tamanho já presentes
      const alreadyPresent = new Set(images.map(f => `${f.name}-${f.size}`));
      const trulyUniqueFiles = newFiles.filter(
        file => !alreadyPresent.has(`${file.name}-${file.size}`)
      );

      // Se não há arquivos novos, não atualiza nada
      if (trulyUniqueFiles.length === 0) return;

      // Cria preview só das imagens únicas
      const newPreviewUrls = trulyUniqueFiles.map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...trulyUniqueFiles]);
      setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const handleRemoveImage = (index: number) => {
    // Remove image and its preview
    const newImages = [...images];
    const newPreviewUrls = [...imagePreviewUrls];
    
    // Revoke the URL to free memory
    URL.revokeObjectURL(newPreviewUrls[index]);
    
    newImages.splice(index, 1);
    newPreviewUrls.splice(index, 1);
    
    setImages(newImages);
    setImagePreviewUrls(newPreviewUrls);
  };

  const resetImages = () => {
    // Revoke all URLs to free memory
    imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    setImages([]);
    setImagePreviewUrls([]);
  };

  return {
    images,
    imagePreviewUrls,
    handleImageChange,
    handleRemoveImage,
    resetImages
  };
};
