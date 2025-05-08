
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";

const Hero = () => {
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  
  const bannerImages = [
    "/lovable-uploads/d31ae657-c225-4f14-b8b8-39eade59dd48.png",
    "/lovable-uploads/c0b49897-08c2-4312-88cf-df7567ba1def.png"
  ];
  
  // Update current slide index when the carousel changes
  useEffect(() => {
    if (!api) return;
    
    const onChange = () => {
      setActiveIndex(api.selectedScrollSnap());
    };
    
    api.on("select", onChange);
    
    // Initial update
    onChange();
    
    return () => {
      api.off("select", onChange);
    };
  }, [api]);
  
  // Auto-rotate carousel
  useEffect(() => {
    if (!api) return;
    
    const interval = setInterval(() => {
      if (activeIndex < bannerImages.length - 1) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [api, activeIndex, bannerImages.length]);
  
  return (
    <section className="relative h-[70vh] md:h-[85vh] min-h-[550px] md:min-h-[650px] w-full overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0">
        <Carousel className="w-full h-full" setApi={setApi}>
          <CarouselContent className="h-full">
            {bannerImages.map((image, index) => (
              <CarouselItem key={index} className="h-full w-full">
                <div 
                  className="w-full h-full bg-cover bg-center bg-no-repeat"
                  style={{ 
                    backgroundImage: `url(${image})`,
                    width: '100%',
                    height: '100%'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/50"></div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
            {bannerImages.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`w-3 h-3 rounded-full ${
                  activeIndex === index ? "bg-gold" : "bg-white/40"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 border-none text-white z-10" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 border-none text-white z-10" />
        </Carousel>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto h-full flex flex-col justify-center items-center text-center px-4 md:px-6 lg:px-12">
        <div className="max-w-xl animate-fade-in">
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
            O 1º Marketplace de <span className="text-gold">Luxo</span> do Brasil
          </h1>
          
          <p className="text-white/90 text-sm md:text-lg lg:text-xl mb-6 md:mb-10 leading-relaxed mx-auto">
            Seu sonho, Nossa missão.
          </p>
          
          <div className="flex flex-wrap gap-3 md:gap-5 justify-center">
            <Button asChild variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 btn-hover-effect text-sm md:text-base px-6 py-2 md:px-8 md:py-6 h-auto">
              <Link to="/sobre">
                Conheça a One Boss
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
