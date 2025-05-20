
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
const SponsorsBanner = () => {
  const isMobile = useIsMobile();
  return <section className="py-6 md:py-8 bg-background border-t border-gold/10">
      <div className={isMobile ? "" : "container mx-auto px-4"}>
        <div className="text-center mb-6 px-4">
          <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-2">
            Parceiros <span className="text-gold"></span>
          </h2>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-muted-foreground">
            Marcas de excelência que compartilham nossa paixão por qualidade e exclusividade
          </p>
        </div>
        
        <div className={`relative h-[300px] w-full ${isMobile ? "" : "rounded-none"} overflow-hidden animate-slide-in-right`}>
          {/* Banner image */}
          <img src="/lovable-uploads/94c4f913-0185-4aaa-b639-fa0e29e727ac.png" alt="EUROFIX banner" className="w-full h-full object-cover" />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30"></div>
          
          {/* Content overlay - centered */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white py-[24px]">
            {/* Logo */}
            <div className="mb-4 w-48 md:w-56">
              <img src="/lovable-uploads/1048c280-9081-420f-a0a1-899e5e5ce851.png" alt="EUROFIX Logo" className="w-full" />
            </div>
            
            {/* Description */}
            <p className="text-base md:text-lg text-center mb-4 max-w-md font-medium">
              Oficina mecânica especializada, preparação e performance
            </p>
            
            {/* Glassmorphism CTA Button */}
            <Button size="sm" className="bg-white/30 backdrop-blur-md border border-white/20 text-white font-medium px-8 py-2.5 rounded-md transition-all duration-300 shadow-lg hover:bg-white/40">
              Saiba Mais
            </Button>
          </div>
        </div>
        
        
      </div>
    </section>;
};
export default SponsorsBanner;
