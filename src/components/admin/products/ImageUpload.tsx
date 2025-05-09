
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import { ProductImage } from "@/types/product";

interface ImageUploadProps {
  images: File[];
  imagePreviewUrls: string[];
  existingImages?: ProductImage[];
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  imagePreviewUrls,
  existingImages = [],
  handleImageChange,
  handleRemoveImage
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Imagens do Produto</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Arraste e solte ou clique para adicionar imagens do produto. 
              Recomendado: 800x800px, máximo 5MB.
            </p>
            
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-8 text-center">
              <input
                type="file"
                id="image-upload"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">
                  Clique para fazer upload ou arraste e solte
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, GIF até 5MB
                </span>
              </label>
            </div>
          </div>
          
          {(imagePreviewUrls.length > 0 || existingImages.length > 0) && (
            <div>
              <h4 className="text-sm font-medium mb-2">Imagens adicionadas</h4>
              <div className="grid grid-cols-3 gap-4">
                {existingImages.map((image, index) => (
                  <div
                    key={`existing-${image.id}`}
                    className="relative aspect-square border rounded-md overflow-hidden"
                  >
                    <img
                      src={image.url}
                      alt={`Imagem do produto ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 rounded-full"
                      onClick={() => handleRemoveImage(index)}
                      type="button"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                
                {imagePreviewUrls.slice(existingImages.length).map((url, index) => (
                  <div
                    key={`new-${index}`}
                    className="relative aspect-square border rounded-md overflow-hidden"
                  >
                    <img
                      src={url}
                      alt={`Nova imagem ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 rounded-full"
                      onClick={() => handleRemoveImage(index + existingImages.length)}
                      type="button"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUpload;
