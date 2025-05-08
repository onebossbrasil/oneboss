
import { Button } from "@/components/ui/button";

const SponsorsBanner = () => {
  return (
    <section className="py-10 md:py-16 bg-background border-t border-gold/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 md:mb-10">
          <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-3 md:mb-4">
            Parceiros <span className="text-gold">Premium</span>
          </h2>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-muted-foreground">
            Marcas de excelência que compartilham nossa paixão por qualidade e exclusividade
          </p>
        </div>
        
        <div className="relative h-64 md:h-96 w-full rounded-xl overflow-hidden">
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
            <div className="mb-4 w-40 md:w-48">
              <img
                src="/lovable-uploads/1048c280-9081-420f-a0a1-899e5e5ce851.png"
                alt="EUROFIX Logo"
                className="w-full"
              />
            </div>
            
            {/* Description */}
            <p className="text-sm md:text-base text-center mb-6 max-w-md">
              Oficina mecânica especializada, preparação e performance
            </p>
            
            {/* Improved CTA Button */}
            <Button 
              size="sm" 
              className="bg-gold hover:bg-gold/80 text-black font-medium px-6 py-2 rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Saiba mais
            </Button>
          </div>
        </div>
        
        <div className="mt-6 md:mt-8 text-center">
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
