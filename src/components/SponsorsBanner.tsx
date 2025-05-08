
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

// Dados simulados dos patrocinadores com imagens de banner
const sponsors = [
  {
    id: 1,
    name: "Luxury Motors",
    logo: "https://images.unsplash.com/photo-1622711443907-b27a8222f838?auto=format&fit=crop&q=80&w=200&h=100",
    banner: "public/lovable-uploads/164c3e3b-747b-42c9-b980-372fc0b8b027.png",
    description: "Especialistas em carros de luxo e superesportivos",
    url: "/parceiros/luxury-motors"
  },
  {
    id: 2,
    name: "Elite Properties",
    logo: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=200&h=100",
    banner: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1200",
    description: "Imóveis de alto padrão em localidades exclusivas",
    url: "/parceiros/elite-properties"
  },
  {
    id: 3,
    name: "Royal Watches",
    logo: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=200&h=100",
    banner: "https://images.unsplash.com/photo-1587925358603-c2eea5305bbc?auto=format&fit=crop&q=80&w=1200",
    description: "Relógios de luxo e peças exclusivas",
    url: "/parceiros/royal-watches"
  },
  {
    id: 4,
    name: "Exclusive Yachts",
    logo: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=200&h=100",
    banner: "https://images.unsplash.com/photo-1566438480900-0609be27a4be?auto=format&fit=crop&q=80&w=1200",
    description: "Iates e embarcações de luxo para experiências exclusivas",
    url: "/parceiros/exclusive-yachts"
  },
  {
    id: 5,
    name: "Premium Jets",
    logo: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=200&h=100",
    banner: "https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&q=80&w=1200",
    description: "Jatos particulares e serviços de aviação executiva",
    url: "/parceiros/premium-jets"
  },
];

const SponsorsBanner = () => {
  const isMobile = useIsMobile();
  
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
          <Carousel
            opts={{ 
              loop: true,
              align: "start"
            }}
            className="w-full"
          >
            <CarouselContent>
              {sponsors.map((sponsor) => (
                <CarouselItem key={sponsor.id} className="pl-0 md:basis-full">
                  <div className="h-64 md:h-[400px] relative w-full overflow-hidden rounded-none md:rounded-xl">
                    {/* Banner Image with Overlay */}
                    <img 
                      src={sponsor.banner} 
                      alt={`${sponsor.name} banner`} 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
                    
                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-16">
                      <div className="max-w-lg">
                        {/* Logo */}
                        <div className="bg-white/90 p-4 rounded-lg mb-4 inline-block">
                          <img 
                            src={sponsor.logo} 
                            alt={sponsor.name} 
                            className="h-8 md:h-12 max-w-[120px] md:max-w-[180px] object-contain"
                          />
                        </div>
                        
                        {/* Name & Description */}
                        <h3 className="text-xl md:text-3xl font-playfair font-bold text-white mb-2 md:mb-4">
                          {sponsor.name}
                        </h3>
                        <p className="text-white/80 text-sm md:text-base mb-4 md:mb-6 max-w-md">
                          {sponsor.description}
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
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="mt-4 md:mt-8 flex items-center justify-center gap-2">
              <CarouselPrevious className="static translate-y-0 h-9 w-9 rounded-full border-gold/30" />
              <CarouselNext className="static translate-y-0 h-9 w-9 rounded-full border-gold/30" />
            </div>
          </Carousel>
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
