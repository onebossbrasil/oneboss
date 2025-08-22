import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect } from "react";
import { ProductImage } from "@/types/product";
import { useIsMobile } from "@/hooks/useIsMobile";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";

interface ProductGalleryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: ProductImage[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

const ProductGalleryModal = ({
  open,
  onOpenChange,
  images,
  currentIndex,
  onNavigate,
}: ProductGalleryModalProps) => {
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        onNavigate((currentIndex - 1 + images.length) % images.length);
      }
      if (e.key === "ArrowRight") {
        onNavigate((currentIndex + 1) % images.length);
      }
    };
    if (open) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line
  }, [open, currentIndex, images.length]);

  if (!images.length) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 sm:max-w-2xl w-[95%] h-auto sm:h-auto rounded-lg sm:rounded-xl overflow-hidden bg-black">
        {isMobile ? (
          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {images.map((image, idx) => (
                  <CarouselItem key={image.id}>
                    <div className="relative w-full h-[50vh] bg-black flex items-center justify-center">
                      <img
                        src={image.url}
                        alt={`Imagem ampliada ${idx + 1}`}
                        className="w-full h-full object-contain"
                        draggable={false}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {images.length > 1 && (
                <>
                  <CarouselPrevious 
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 p-2.5 rounded-full text-white"
                    onClick={() => onNavigate((currentIndex - 1 + images.length) % images.length)}
                  />
                  <CarouselNext 
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 p-2.5 rounded-full text-white"
                    onClick={() => onNavigate((currentIndex + 1) % images.length)}
                  />
                </>
              )}
            </Carousel>

            <button
              aria-label="Fechar"
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 z-50 bg-black/70 rounded-full p-2.5 text-white hover:bg-black/90 transition"
            >
              <X size={24} />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm z-50">
              {currentIndex + 1} de {images.length}
            </div>
          </div>
        ) : (
          <div className="relative w-full h-[70vh] bg-black flex items-center justify-center">
            <img
              src={images[currentIndex].url}
              alt={`Imagem ampliada ${currentIndex + 1}`}
              className="w-full h-full object-contain"
              draggable={false}
            />
            <button
              aria-label="Fechar"
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 bg-black/70 rounded-full p-2.5 text-white hover:bg-black/90 transition z-50"
            >
              <X size={24} />
            </button>
            {images.length > 1 && (
              <>
                <button
                  aria-label="Anterior"
                  onClick={() =>
                    onNavigate((currentIndex - 1 + images.length) % images.length)
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 p-2.5 rounded-full text-white"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  aria-label="Próxima"
                  onClick={() =>
                    onNavigate((currentIndex + 1) % images.length)
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 p-2.5 rounded-full text-white"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}
          </div>
        )}

        <div className="flex justify-center py-3 px-2 gap-2 bg-zinc-950 overflow-x-auto">
          {images.map((img, idx) => (
            <button
              key={img.id}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded border-2 flex-shrink-0 ${currentIndex === idx ? "border-primary" : "border-transparent"}`}
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
