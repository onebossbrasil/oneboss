import { useState, useEffect } from "react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ProductImage } from "@/types/product";
import { Search, X } from "lucide-react";
import ProductGalleryModal from "./ProductGalleryModal";
import { useIsMobile } from "@/hooks/useIsMobile";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

const ProductGallery = ({ images, productName }: ProductGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [zoomActive, setZoomActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showModal, setShowModal] = useState(false);
  const isMobile = useIsMobile();

  // DEBUG: Log para verificar quantas imagens chegaram
  console.log(`[ProductGallery] ${productName}: recebeu ${images.length} imagens:`, images);

  // Set first image as selected when images change
  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(0);
    }
  }, [images]);

  // Fallback image if no images provided
  const fallbackImage = "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=600&h=400";

  // Handle zoom functionality
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomActive) return;
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setMousePosition({ x, y });
  };

  const toggleZoom = () => {
    setZoomActive(!zoomActive);
  };

  // Open modal for both desktop and mobile
  const handleImageClick = () => {
    setShowModal(true);
  };

  return (
    <div className="product-gallery">
      {/* Main Image with Zoom/Modal */}
      {isMobile ? (
        <Carousel
          className="w-full mb-4"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={image.id}>
                <div 
                  className="relative aspect-[4/3] bg-gray-100 border rounded-lg overflow-hidden"
                  onClick={handleImageClick}
                >
                  <img
                    src={image.url}
                    alt={`${productName} - Imagem ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div 
                    className="absolute bottom-4 right-4 p-2 rounded-full bg-black/60 text-white"
                  >
                    <Search size={18} />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {images.length > 1 && (
            <>
              <CarouselPrevious className="left-2 bg-white/90 hover:bg-white" />
              <CarouselNext className="right-2 bg-white/90 hover:bg-white" />
            </>
          )}
          {/* Image counter for mobile */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {selectedImage + 1} de {images.length}
            </div>
          )}
        </Carousel>
      ) : (
        <div className="relative mb-4 rounded-lg overflow-hidden bg-gray-100 border">
          {zoomActive && (
            <div 
              className="absolute top-0 right-0 z-20 p-2"
              onClick={toggleZoom}
            >
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-black/60 text-white">
                <X size={18} />
              </button>
            </div>
          )}
          
          <div 
            className="relative overflow-hidden cursor-pointer"
            onClick={handleImageClick}
            style={{ aspectRatio: "4/3" }}
          >
            <div 
              className={`${zoomActive ? 'absolute top-0 left-0 w-full h-full' : ''}`}
            >
              {images.length > 0 ? (
                <div 
                  className={`relative w-full h-full ${zoomActive ? 'scale-150' : ''}`}
                  style={
                    zoomActive ? {
                      transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
                    } : {}
                  }
                >
                  <img
                    src={images[selectedImage]?.url || fallbackImage}
                    alt={`${productName} - Imagem ${selectedImage + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <p className="text-gray-500">Sem imagens disponíveis</p>
                </div>
              )}
            </div>
            
            {!zoomActive && images.length > 0 && (
              <div 
                className="absolute bottom-4 right-4 p-2 rounded-full bg-black/60 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageClick();
                }}
              >
                <Search size={18} />
              </div>
            )}
          </div>
        </div>
      )}

      <ProductGalleryModal
        open={showModal}
        onOpenChange={setShowModal}
        images={images}
        currentIndex={selectedImage}
        onNavigate={(i) => setSelectedImage(i)}
      />

      {/* Thumbnail Carousel */}
      {images.length > 1 && !isMobile && (
        <div className="mt-4">
          <Carousel
            opts={{
              align: "start",
              loop: images.length > 4,
              dragFree: true,
              containScroll: "trimSnaps",
            }}
            className="w-full"
          >
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={image.id} className="basis-1/4 sm:basis-1/5 lg:basis-1/6">
                  <AspectRatio ratio={1} className="bg-muted">
                    <button
                      className={`w-full h-full p-0.5 relative ${
                        selectedImage === index
                          ? "ring-2 ring-primary"
                          : "ring-1 ring-gray-200 hover:ring-gray-300"
                      }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img
                        src={image.url}
                        alt={`${productName} - Miniatura ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  </AspectRatio>
                </CarouselItem>
              ))}
            </CarouselContent>
            {images.length > 4 && (
              <>
                <CarouselPrevious className="left-1 bg-white/90 hover:bg-white shadow-md" />
                <CarouselNext className="right-1 bg-white/90 hover:bg-white shadow-md" />
              </>
            )}
          </Carousel>
          {/* Image counter */}
          {images.length > 1 && (
            <div className="text-center mt-2 text-sm text-muted-foreground">
              {selectedImage + 1} de {images.length} imagens
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
