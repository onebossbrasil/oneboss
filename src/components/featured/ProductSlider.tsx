
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProductItem from "./ProductItem";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
import { FormattedProduct } from "@/types/product";

type ProductSliderProps = {
  products: FormattedProduct[];
};

const ProductSlider = ({ products }: ProductSliderProps) => {
  const [api, setApi] = useState<ReturnType<typeof useEmblaCarousel>[1]>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  
  // Handle scroll button state based on carousel position
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    api.on("select", onSelect);
    api.on("reInit", onSelect);

    // Initial check
    onSelect();

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  // Auto scroll functionality with infinite loop
  useEffect(() => {
    if (!api || isPaused) return;
    
    const interval = setInterval(() => {
      if (!api.canScrollNext()) {
        // If we're at the end, scroll back to the beginning
        api.scrollTo(0);
      } else {
        // Otherwise, scroll to next
        api.scrollNext();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [api, isPaused]);
  
  // Custom carousel options for product display
  const carouselOptions = {
    align: "start" as const,
    loop: true,
    skipSnaps: false,
    dragFree: false,
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-playfair text-3xl font-bold">Produtos em Destaque</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            disabled={!canScrollPrev}
            onClick={() => api?.scrollPrev()}
            className={cn(
              "rounded-full",
              canScrollPrev ? "hover:text-gold hover:border-gold" : "opacity-50"
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={!canScrollNext}
            onClick={() => api?.scrollNext()}
            className={cn(
              "rounded-full",
              canScrollNext ? "hover:text-gold hover:border-gold" : "opacity-50"
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <Carousel
        setApi={setApi}
        opts={carouselOptions}
        className="w-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <CarouselContent className="-ml-6">
          {products.map((product) => (
            <CarouselItem 
              key={product.id}
              className="pl-6 basis-full md:basis-1/2 lg:basis-1/3"
            >
              <ProductItem product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* We're using custom controls above, so we'll hide these */}
        <div className="hidden">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
    </div>
  );
};

export default ProductSlider;
