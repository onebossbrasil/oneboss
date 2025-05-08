
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

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
        
        <div className="-mx-4 md:-mx-8">
          <div className="h-64 md:h-[400px] relative w-full overflow-hidden rounded-none md:rounded-xl">
            {/* Banner Image with Overlay */}
            <img 
              src="public/lovable-uploads/76b09313-9bde-4f3b-9860-cc2f42f6a79b.png" 
              alt="EUROFIX banner" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70"></div>
            
            {/* Content Overlay - Centered */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-16">
              <div className="max-w-lg text-center">
                {/* Logo */}
                <div className="bg-white/90 p-4 rounded-lg mb-4 inline-block">
                  <img 
                    src="public/lovable-uploads/164c3e3b-747b-42c9-b980-372fc0b8b027.png" 
                    alt="EUROFIX" 
                    className="h-8 md:h-12 max-w-[120px] md:max-w-[180px] object-contain"
                  />
                </div>
                
                {/* Name & Description */}
                <h3 className="text-xl md:text-3xl font-playfair font-bold text-white mb-2 md:mb-4">
                  EUROFIX
                </h3>
                <p className="text-white/80 text-sm md:text-base mb-4 md:mb-6 max-w-md mx-auto">
                  Oficina mecânica especializada, preparação e performance
                </p>
                
                {/* CTA Button */}
                <Button 
                  variant="outline" 
                  className="border border-gold/30 hover:border-gold text-gold hover:bg-gold hover:text-white transition-all duration-300 group"
                >
                  Conhecer parceiro
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 md:mt-10 text-center">
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
