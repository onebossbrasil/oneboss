
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";

const Hero = () => {
  const isMobile = useIsMobile();
  const [autoPlay, setAutoPlay] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const carouselImages = [
    'url(/lovable-uploads/b5183090-ac85-4c8b-b250-2cd368f49a4c.png)',
    'url(/lovable-uploads/3602c2f3-d103-44c1-9798-c2f135541e04.png)'
  ];

  useEffect(() => {
    if (!autoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoPlay, carouselImages.length]);
  
  return (
    <section className="relative h-[70vh] md:h-[85vh] min-h-[550px] md:min-h-[650px] w-full overflow-hidden">
      {/* Carousel Background Images */}
      <Carousel 
        className="h-full w-full absolute inset-0"
        setApi={(api) => {
          if (api) {
            api.scrollTo(currentSlide);
            api.on('select', () => {
              setCurrentSlide(api.selectedScrollSnap());
            });
          }
        }}
      >
        <CarouselContent className="h-full">
          {carouselImages.map((image, index) => (
            <CarouselItem key={index} className="h-full">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat h-full w-full transition-opacity duration-500"
                style={{ backgroundImage: image }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/50"></div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 z-20 bg-black/30 text-white border-gold hover:bg-black/50 hover:text-gold" />
        <CarouselNext className="right-4 z-20 bg-black/30 text-white border-gold hover:bg-black/50 hover:text-gold" />
      </Carousel>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto h-full flex flex-col justify-center items-center text-center px-4 md:px-6 lg:px-12">
        <div className="max-w-xl animate-fade-in">
          <div className="mb-3 md:mb-4">
            <div className="glassmorphism px-3 py-1 md:px-4 md:py-1 rounded-full text-xs md:text-sm uppercase tracking-wider text-gold">
              Experiência Ultra Premium
            </div>
          </div>
          
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
            O melhor do <span className="text-gold">luxo</span> em um só lugar
          </h1>
          
          <p className="text-white/90 text-sm md:text-lg lg:text-xl mb-6 md:mb-10 leading-relaxed mx-auto">
            Acesso exclusivo aos produtos mais sofisticados e experiências extraordinárias para quem valoriza o excepcional.
          </p>
          
          <div className="flex flex-wrap gap-3 md:gap-5 justify-center">
            <Button asChild className="bg-gold hover:bg-gold-light text-white border-none btn-hover-effect text-sm md:text-base px-6 py-2 md:px-8 md:py-6 h-auto">
              <Link to="/loja">
                Explorar coleção <ChevronRight className="ml-1 md:ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Link>
            </Button>
            
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
