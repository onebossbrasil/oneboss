
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect } from "react";
import { ProductImage } from "@/types/product";

interface ProductGalleryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: ProductImage[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

const MAX_GALLERY_IMAGES = 30;

const ProductGalleryModal = ({
  open,
  onOpenChange,
  images,
  currentIndex,
  onNavigate,
}: ProductGalleryModalProps) => {
  // Exibe no máximo 30 imagens cadastradas
  const limitedImages = images.slice(0, MAX_GALLERY_IMAGES);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        onNavigate((currentIndex - 1 + limitedImages.length) % limitedImages.length);
      }
      if (e.key === "ArrowRight") {
        onNavigate((currentIndex + 1) % limitedImages.length);
      }
    };
    if (open) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line
  }, [open, currentIndex, limitedImages.length]);

  if (!limitedImages.length) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-2xl rounded-xl overflow-hidden bg-black">
        <div className="relative w-full h-[70vh] bg-black flex items-center justify-center">
          <img
            src={limitedImages[currentIndex].url}
            alt={`Imagem ampliada ${currentIndex + 1}`}
            className="w-full h-full object-contain"
            draggable={false}
          />
          <button
            aria-label="Fechar"
            onClick={() => onOpenChange(false)}
            className="absolute top-3 right-3 bg-black/70 rounded-full p-2 text-white hover:bg-black/90 transition"
          >
            <X />
          </button>
          {limitedImages.length > 1 && (
            <>
              <button
                aria-label="Anterior"
                onClick={() =>
                  onNavigate((currentIndex - 1 + limitedImages.length) % limitedImages.length)
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 p-2 rounded-full text-white"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                aria-label="Próxima"
                onClick={() =>
                  onNavigate((currentIndex + 1) % limitedImages.length)
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 p-2 rounded-full text-white"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}
        </div>
        <div className="flex justify-center py-3 gap-2 bg-zinc-950 overflow-x-auto">
          {limitedImages.map((img, idx) => (
            <button
              key={img.id}
              className={`w-14 h-14 rounded border-2 ${currentIndex === idx ? "border-primary" : "border-transparent"}`}
              onClick={() => onNavigate(idx)}
              aria-label={`Miniatura ${idx + 1}`}
            >
              <img
                src={img.url}
                className="w-full h-full object-cover rounded"
                alt={`Miniatura ${idx + 1}`}
                draggable={false}
              />
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductGalleryModal;
