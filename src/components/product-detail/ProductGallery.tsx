
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

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

const ProductGallery = ({ images, productName }: ProductGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [zoomActive, setZoomActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  return (
    <div className="product-gallery">
      {/* Main Image with Zoom */}
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
          className={`relative overflow-hidden ${zoomActive ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
          onClick={toggleZoom}
          onMouseMove={handleMouseMove}
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
                toggleZoom();
              }}
            >
              <Search size={18} />
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail Carousel */}
      {images.length > 1 && (
        <div className="mt-4">
          <Carousel
            opts={{
              align: "start",
              loop: images.length > 4,
            }}
            className="w-full"
          >
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={image.id} className="basis-1/5 sm:basis-1/5 lg:basis-1/6">
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
            {images.length > 5 && (
              <>
                <CarouselPrevious className="left-1" />
                <CarouselNext className="right-1" />
              </>
            )}
          </Carousel>
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
