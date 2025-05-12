
import { useState, useEffect } from "react";
import { Product, ProductImage } from "@/types/product";

export const useImageManagement = (product: Product | null) => {
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);

  // Reset images when product changes
  useEffect(() => {
    if (product) {
      setImagePreviewUrls(product.images.map(img => img.url));
      setImages([]);
      setDeletedImageIds([]); // Reset deleted image IDs
    }
  }, [product]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // Create preview URLs
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      
      setImages(prev => [...prev, ...newFiles]);
      setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };
  
  const handleRemoveImage = (index: number) => {
    if (!product) return;

    // Check if this is an existing image from the database
    if (index < product.images.length) {
      const imageToDelete = product.images[index];
      setDeletedImageIds(prev => [...prev, imageToDelete.id]);
      
      // Remove from preview URLs
      const newPreviewUrls = [...imagePreviewUrls];
      newPreviewUrls.splice(index, 1);
      setImagePreviewUrls(newPreviewUrls);
    } else {
      // This is a newly added image
      const newImageIndex = index - product.images.length;
      
      // Remove from images array
      const newImages = [...images];
      newImages.splice(newImageIndex, 1);
      setImages(newImages);
      
      // Revoke URL to free memory
      URL.revokeObjectURL(imagePreviewUrls[index]);
      
      // Remove from preview URLs
      const newPreviewUrls = [...imagePreviewUrls];
      newPreviewUrls.splice(index, 1);
      setImagePreviewUrls(newPreviewUrls);
    }
  };

  return {
    images,
    imagePreviewUrls,
    deletedImageIds,
    handleImageChange,
    handleRemoveImage,
  };
};
