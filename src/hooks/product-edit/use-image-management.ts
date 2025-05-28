
import { useState, useEffect } from "react";
import { Product, ProductImage } from "@/types/product";

export const useImageManagement = (product: Product | null) => {
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (product?.images) {
      setImagePreviewUrls(product.images.map(img => img.url));
      setImages([]);
      setDeletedImageIds([]);
      setErrorMsg(null);
      setIsUploading(false);
      console.log("[useImageManagement] Imagens fresh do produto:", product.images.length, product.images);
    } else {
      setImagePreviewUrls([]);
      setImages([]);
      setDeletedImageIds([]);
      setErrorMsg(null);
      setIsUploading(false);
      console.log("[useImageManagement] Resetou imagens (novo produto ou sem produto)");
    }
  }, [product?.id, product?.images?.length]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isUploading) {
      setErrorMsg("Aguarde o upload anterior terminar antes de adicionar novas imagens.");
      return;
    }

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

      // NOVA VALIDAÇÃO: Evitar duplicatas baseadas em nome e tamanho do arquivo
      const existingFileSignatures = new Set([
        ...images.map(img => `${img.name}-${img.size}`),
        ...(product?.images || []).map(img => {
          // Para imagens existentes, usar apenas o nome do arquivo da URL
          const urlParts = img.url.split('/');
          const fileName = urlParts[urlParts.length - 1];
          return fileName;
        })
      ]);

      const uniqueNewFiles = acceptedFiles.filter(newFile => {
        const fileSignature = `${newFile.name}-${newFile.size}`;
        const isAlreadyLocal = existingFileSignatures.has(fileSignature);
        const isAlreadyRemote = existingFileSignatures.has(newFile.name);
        
        if (isAlreadyLocal || isAlreadyRemote) {
          console.log(`[useImageManagement] Arquivo duplicado rejeitado: ${newFile.name}`);
          return false;
        }
        return true;
      });

      if (uniqueNewFiles.length === 0 && acceptedFiles.length > 0) {
        setErrorMsg("Todas as imagens selecionadas já foram adicionadas.");
        return;
      }

      if (uniqueNewFiles.length < acceptedFiles.length) {
        setErrorMsg(`${acceptedFiles.length - uniqueNewFiles.length} imagem(ns) duplicada(s) foram ignoradas.`);
      }

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

      if (trulyUniqueFiles.length > 0) {
        setIsUploading(true);
        const newPreviewUrls = trulyUniqueFiles.map(file => URL.createObjectURL(file));
        setImages(prev => [...prev, ...trulyUniqueFiles]);
        setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
        console.log("[useImageManagement] Imagens novas adicionadas (sem duplicadas):", trulyUniqueFiles.map(f => f.name));
        
        // Reset upload state after a brief delay
        setTimeout(() => setIsUploading(false), 1000);
      }
    }
    
    // Reset input para permitir reselecionar o mesmo arquivo se necessário
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    if (isUploading) {
      setErrorMsg("Não é possível remover imagens durante o upload.");
      return;
    }

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
    setErrorMsg,
    isUploading
  };
};
