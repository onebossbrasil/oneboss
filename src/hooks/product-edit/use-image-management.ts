
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
      console.log(`[useImageManagement] Carregando ${product.images.length} imagens do produto ${product.name}`);
      setImagePreviewUrls(product.images.map(img => img.url));
      setImages([]);
      setDeletedImageIds([]);
      setErrorMsg(null);
      setIsUploading(false);
    } else {
      console.log(`[useImageManagement] Resetando estado (novo produto ou sem imagens)`);
      setImagePreviewUrls([]);
      setImages([]);
      setDeletedImageIds([]);
      setErrorMsg(null);
      setIsUploading(false);
    }
  }, [product?.id, product?.images?.length]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isUploading) {
      setErrorMsg("Aguarde o upload anterior terminar antes de adicionar novas imagens.");
      return;
    }

    setErrorMsg(null);
    console.log(`[useImageManagement] Iniciando seleção de arquivos`);
    
    if (e.target.files) {
      const ALLOWED_TYPES = [
        "image/png",
        "image/jpeg", 
        "image/jpg",
        "image/webp"
      ];
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      const newFiles = Array.from(e.target.files);
      
      console.log(`[useImageManagement] ${newFiles.length} arquivos selecionados`);
      
      // Validação de tipo e tamanho
      const rejectedFiles: string[] = [];
      const acceptedFiles = newFiles.filter(file => {
        if (!ALLOWED_TYPES.includes(file.type)) {
          rejectedFiles.push(`${file.name} (formato inválido)`);
          return false;
        }
        if (file.size > MAX_FILE_SIZE) {
          rejectedFiles.push(`${file.name} (muito grande: ${(file.size / 1024 / 1024).toFixed(1)}MB)`);
          return false;
        }
        return true;
      });
      
      if (rejectedFiles.length > 0) {
        setErrorMsg(`Arquivos rejeitados: ${rejectedFiles.join(', ')}`);
      }
      
      if (acceptedFiles.length === 0) {
        console.log(`[useImageManagement] Nenhum arquivo válido para upload`);
        return;
      }

      // MELHORADO: Validação de duplicatas mais robusta
      const existingFileSignatures = new Set([
        ...images.map(img => `${img.name}-${img.size}`),
        ...(product?.images || []).map(img => {
          const urlParts = img.url.split('/');
          const fileName = urlParts[urlParts.length - 1];
          return fileName.split('_')[1] || fileName; // Remove timestamp prefix
        })
      ]);

      const uniqueNewFiles = acceptedFiles.filter(newFile => {
        const fileSignature = `${newFile.name}-${newFile.size}`;
        const nameOnly = newFile.name;
        
        const isDuplicate = existingFileSignatures.has(fileSignature) || 
                           existingFileSignatures.has(nameOnly) ||
                           images.some(existing => 
                             existing.name === newFile.name && existing.size === newFile.size
                           );
        
        if (isDuplicate) {
          console.log(`[useImageManagement] Arquivo duplicado rejeitado: ${newFile.name}`);
          return false;
        }
        return true;
      });

      const duplicateCount = acceptedFiles.length - uniqueNewFiles.length;
      if (duplicateCount > 0) {
        const prevError = errorMsg || "";
        setErrorMsg(`${prevError}${prevError ? " " : ""}${duplicateCount} imagem(ns) duplicada(s) ignorada(s).`);
      }

      if (uniqueNewFiles.length === 0) {
        console.log(`[useImageManagement] Todas as imagens são duplicadas`);
        return;
      }

      // MELHORADO: Evita duplicatas no mesmo upload
      const finalUniqueFiles: File[] = [];
      const seenInCurrentBatch = new Set<string>();
      
      for (const file of uniqueNewFiles) {
        const key = `${file.name}-${file.size}`;
        if (!seenInCurrentBatch.has(key)) {
          finalUniqueFiles.push(file);
          seenInCurrentBatch.add(key);
        }
      }

      if (finalUniqueFiles.length > 0) {
        console.log(`[useImageManagement] Adicionando ${finalUniqueFiles.length} imagens únicas: ${finalUniqueFiles.map(f => f.name).join(', ')}`);
        
        setIsUploading(true);
        const newPreviewUrls = finalUniqueFiles.map(file => URL.createObjectURL(file));
        setImages(prev => [...prev, ...finalUniqueFiles]);
        setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
        
        // NOVO: Feedback visual melhorado
        if (errorMsg) {
          setErrorMsg(`${errorMsg} ${finalUniqueFiles.length} nova(s) imagem(ns) adicionada(s).`);
        }
        
        // Reset upload state after a brief delay
        setTimeout(() => {
          setIsUploading(false);
          console.log(`[useImageManagement] Upload state resetado`);
        }, 1500);
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

    console.log(`[useImageManagement] Removendo imagem no índice ${index}`);

    if (product && index < (product.images?.length ?? 0)) {
      // Remove imagem do banco
      const imageToDelete = product.images[index];
      console.log(`[useImageManagement] Marcando imagem do BD para deleção: ${imageToDelete.id}`);
      
      setDeletedImageIds(prev => [...prev, imageToDelete.id]);
      // Remove do preview (mantém ordem)
      const newPreviewUrls = [...imagePreviewUrls];
      newPreviewUrls.splice(index, 1);
      setImagePreviewUrls(newPreviewUrls);
    } else {
      // Imagem nova ainda não persistida
      const newImageIndex = index - (product?.images?.length ?? 0);
      const removedImage = images[newImageIndex];
      
      console.log(`[useImageManagement] Removendo imagem local: ${removedImage?.name || 'desconhecida'}`);
      
      const newImages = [...images];
      const previewUrl = imagePreviewUrls[index];
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      
      newImages.splice(newImageIndex, 1);
      const newPreviewUrls = [...imagePreviewUrls];
      newPreviewUrls.splice(index, 1);
      
      setImages(newImages);
      setImagePreviewUrls(newPreviewUrls);
    }
    
    setErrorMsg(null); // Clear error when user takes action
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
