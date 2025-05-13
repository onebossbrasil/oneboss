
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const SponsorsBanner = () => {
  const isMobile = useIsMobile();
  
  return (
    <section className="py-10 md:py-16 bg-background border-t border-gold/10">
      <div className={isMobile ? "" : "container mx-auto px-4"}>
        <div className="text-center mb-6 md:mb-10 px-4">
          <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-3 md:mb-4">
            Parceiros <span className="text-gold">Premium</span>
          </h2>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-muted-foreground">
            Marcas de excelência que compartilham nossa paixão por qualidade e exclusividade
          </p>
        </div>
        
        <div className={`relative ${isMobile ? "h-96" : "h-64 md:h-96"} w-full ${isMobile ? "" : "rounded-xl"} overflow-hidden animate-slide-in-right`}>
          {/* Banner image */}
          <img 
            src="/lovable-uploads/94c4f913-0185-4aaa-b639-fa0e29e727ac.png" 
            alt="EUROFIX banner" 
            className="w-full h-full object-cover"
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30"></div>
          
          {/* Content overlay - centered */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white">
            {/* Logo */}
            <div className="mb-5 w-48 md:w-56">
              <img
                src="/lovable-uploads/1048c280-9081-420f-a0a1-899e5e5ce851.png"
                alt="EUROFIX Logo"
                className="w-full"
              />
            </div>
            
            {/* Description */}
            <p className="text-base md:text-lg text-center mb-7 max-w-md font-medium">
              Oficina mecânica especializada, preparação e performance
            </p>
            
            {/* Glassmorphism CTA Button */}
            <Button 
              size="sm" 
              className="bg-white/30 backdrop-blur-md border border-white/20 text-white font-medium px-8 py-2.5 rounded-md transition-all duration-300 shadow-lg hover:bg-white/40"
            >
              Saiba Mais
            </Button>
          </div>
        </div>
        
        <div className="mt-6 md:mt-8 text-center px-4">
          <Button 
            variant="outline" 
            className="border border-gold/30 hover:border-gold text-gold hover:bg-gold hover:text-white transition-all duration-300"
          >
            Seja nosso parceiro
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SponsorsBanner;
