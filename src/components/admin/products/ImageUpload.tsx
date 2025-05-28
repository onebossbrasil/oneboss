
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, ImageOff, Loader2 } from "lucide-react";
import { ProductImage } from "@/types/product";

interface ImageUploadProps {
  images: File[];
  imagePreviewUrls: string[];
  existingImages?: ProductImage[];
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  errorMsg?: string | null;
  isUploading?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  imagePreviewUrls,
  existingImages = [],
  handleImageChange,
  handleRemoveImage,
  errorMsg = null,
  isUploading = false
}) => {
  const isDisabled = isUploading;
  const fallbackImg = "/placeholder.svg";

  // Diagnóstico: mostrar todas imagens persistidas
  console.log("[ImageUpload-DIAG] existingImages:", existingImages);

  // Apenas imagens existentes com URL válida
  const validExistingImages = Array.isArray(existingImages)
    ? existingImages.filter(
        img =>
          img &&
          typeof img.url === "string" &&
          img.url.trim() !== ""
      )
    : [];
  const hasImages = (validExistingImages.length > 0 || imagePreviewUrls.length > 0);
  const totalImagens = validExistingImages.length + images.length;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Imagens do Produto</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Arraste e solte ou clique para adicionar imagens.&nbsp;
              <span className="font-semibold">Formatos permitidos: PNG, JPG, JPEG, WEBP.</span><br />
              Recomendado: 800x800px, máximo 5MB por arquivo. Não há limite para quantidade.
            </p>
            <div className={`border-2 border-dashed border-muted-foreground/25 rounded-md p-8 text-center ${isDisabled ? 'opacity-50' : ''}`}>
              <input
                type="file"
                id="image-upload"
                multiple
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleImageChange}
                disabled={isDisabled}
              />
              <label
                htmlFor="image-upload"
                className={`cursor-pointer flex flex-col items-center justify-center ${isDisabled ? "opacity-50 pointer-events-none" : ""}`}
              >
                {isUploading ? (
                  <Loader2 className="h-10 w-10 text-muted-foreground mb-2 animate-spin" />
                ) : (
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                )}
                <span className="text-sm text-muted-foreground">
                  {isUploading ? "Processando imagens..." : "Clique para fazer upload ou arraste e solte"}
                </span>
                <span className="text-xs text-muted-foreground mt-1">PNG, JPG, JPEG ou WEBP até 5MB</span>
              </label>
            </div>
          </div>
          {errorMsg && (
            <div className="text-red-700 text-xs py-2 flex items-center gap-2">
              <ImageOff className="w-4 h-4" /> {errorMsg}
            </div>
          )}
          {!hasImages && !isUploading && (
            <div className="text-red-700 text-xs py-2 flex items-center gap-2">
              <ImageOff className="w-4 h-4" /> Nenhuma imagem disponível para este produto do banco ou local. Verifique o cadastro ou upload.
            </div>
          )}
          {hasImages && (
            <div>
              <h4 className="text-sm font-medium mb-2">Imagens adicionadas</h4>
              <div className="flex gap-2 items-center mb-2">
                <span className="inline-block px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 text-xs border">
                  {totalImagens} imagem(ns) exibidas
                </span>
                {isUploading && (
                  <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs border">
                    Processando...
                  </span>
                )}
              </div>
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
                    {isUploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                      </div>
                    )}
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
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUpload;
