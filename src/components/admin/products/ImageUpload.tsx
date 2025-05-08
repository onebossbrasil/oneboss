
import { useState } from "react";
import { Image } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ImageUploadProps = {
  images: File[];
  imagePreviewUrls: string[];
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
};

const ImageUpload = ({ 
  images, 
  imagePreviewUrls, 
  handleImageChange, 
  handleRemoveImage 
}: ImageUploadProps) => {
  return (
    <div className="space-y-4">
      <Label htmlFor="images">Imagens do Produto</Label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md">
        <div className="space-y-1 text-center">
          <Image className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-gold hover:text-gold-dark focus-within:outline-none">
              <span>Fazer upload de imagens</span>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={handleImageChange}
              />
            </label>
            <p className="pl-1">ou arraste e solte</p>
          </div>
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF até 10MB
          </p>
        </div>
      </div>
      
      {imagePreviewUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-2">
          {imagePreviewUrls.map((url, index) => (
            <div key={index} className="relative">
              <img 
                src={url} 
                alt={`Preview ${index}`}
                className="h-24 w-full object-cover rounded-md"
              />
              <button
                type="button"
                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"
                onClick={() => handleRemoveImage(index)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
