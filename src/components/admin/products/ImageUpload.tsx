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
  const isDisabled = false;
  const fallbackImg = "/placeholder.svg";

  // Diagnóstico: mostrar todas imagens persistidas
  console.log("[ImageUpload] existingImages do modal:", existingImages);

  // Sempre filtra imagens com url válida
  const validExistingImages =
    Array.isArray(existingImages)
      ? existingImages.filter(
          img =>
            img &&
            typeof img.url === "string" &&
            img.url.trim() !== ""
        )
      : [];
  const hasImages = (validExistingImages.length > 0 || imagePreviewUrls.length > 0);

  // Diagnóstico visual extra
  if (!hasImages) {
    console.warn(
      "[ImageUpload] Nenhuma imagem existente, nem preview local -- EXISTING:",
      existingImages,
      "PREVIEW URLs:",
      imagePreviewUrls
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Imagens do Produto</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Arraste e solte ou clique para adicionar imagens. 
              Recomendado: 800x800px, máximo 5MB por arquivo. Não há limite para quantidade.
            </p>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-8 text-center">
              <input
                type="file"
                id="image-upload"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={isDisabled}
              />
              <label
                htmlFor="image-upload"
                className={`cursor-pointer flex flex-col items-center justify-center ${isDisabled ? "opacity-50 pointer-events-none" : ""}`}
              >
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Clique para fazer upload ou arraste e solte</span>
                <span className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF até 5MB</span>
              </label>
            </div>
          </div>
          {!hasImages && (
            <div className="text-red-700 text-xs py-2">
              Nenhuma imagem disponível para este produto do banco ou local. Verifique o cadastro ou upload.
            </div>
          )}
          {hasImages && (
            <div>
              <h4 className="text-sm font-medium mb-2">Imagens adicionadas</h4>
              <div
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `repeat(auto-fill, minmax(120px, 1fr))`
                }}
              >
                {/* Imagens persistidas */}
                {validExistingImages.map((image, index) => (
                  <div
                    key={`existing-${image.id}`}
                    className="relative aspect-square border rounded-md overflow-hidden bg-gray-50"
                  >
                    <img
                      src={image.url}
                      alt={`Imagem do produto ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = fallbackImg; }}
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      disabled={isDisabled}
                      className="absolute top-1 right-1 h-6 w-6 rounded-full"
                      onClick={() => handleRemoveImage(index)}
                      type="button"
                      aria-label="Excluir imagem"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {/* Previews de upload local */}
                {imagePreviewUrls.slice(validExistingImages.length).map((url, index) => (
                  <div
                    key={`new-${index}`}
                    className="relative aspect-square border rounded-md overflow-hidden bg-gray-50"
                  >
                    <img
                      src={url}
                      alt={`Nova imagem ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = fallbackImg; }}
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      disabled={isDisabled}
                      className="absolute top-1 right-1 h-6 w-6 rounded-full"
                      onClick={() => handleRemoveImage(index + validExistingImages.length)}
                      type="button"
                      aria-label="Remover imagem carregada"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {validExistingImages.length + images.length} imagem(ns) no total.
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUpload;
