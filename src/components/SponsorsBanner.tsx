
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Dados simulados dos patrocinadores
const sponsors = [
  {
    id: 1,
    name: "Luxury Motors",
    description: "Experiência premium em veículos de alto padrão",
    logo: "https://images.unsplash.com/photo-1622711443907-b27a8222f838?auto=format&fit=crop&q=80&w=200&h=100",
    banner: "https://images.unsplash.com/photo-1610647752706-3bb12002b0e3?auto=format&fit=crop&q=80&w=1200&h=400",
    url: "/parceiros/luxury-motors"
  },
  {
    id: 2,
    name: "Elite Properties",
    description: "Imóveis exclusivos para clientes exigentes",
    logo: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=200&h=100",
    banner: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200&h=400",
    url: "/parceiros/elite-properties"
  },
  {
    id: 3,
    name: "Royal Watches",
    description: "Relógios de luxo e peças colecionáveis",
    logo: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=200&h=100",
    banner: "https://images.unsplash.com/photo-1619946794135-5bc917a27793?auto=format&fit=crop&q=80&w=1200&h=400",
    url: "/parceiros/royal-watches"
  },
  {
    id: 4,
    name: "Exclusive Yachts",
    description: "Navegue com estilo em nossos iates de luxo",
    logo: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=200&h=100",
    banner: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?auto=format&fit=crop&q=80&w=1200&h=400",
    url: "/parceiros/exclusive-yachts"
  },
  {
    id: 5,
    name: "Premium Jets",
    description: "Voe pelo mundo com privacidade e conforto",
    logo: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=200&h=100",
    banner: "https://images.unsplash.com/photo-1608023136037-d442091ec7e5?auto=format&fit=crop&q=80&w=1200&h=400",
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
        
        <Carousel
          opts={{
            loop: true,
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            {sponsors.map((sponsor) => (
              <CarouselItem key={sponsor.id} className="md:basis-full">
                <div className="relative h-64 md:h-80 w-full rounded-xl overflow-hidden">
                  {/* Banner image */}
                  <img 
                    src={sponsor.banner} 
                    alt={`${sponsor.name} banner`} 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30"></div>
                  
                  {/* Content overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white">
                    {/* Logo */}
                    <div className="bg-white/90 p-3 rounded-lg shadow-lg mb-4">
                      <img 
                        src={sponsor.logo} 
                        alt={sponsor.name} 
                        className="h-12 md:h-16 max-w-[120px] md:max-w-[160px] object-contain"
                      />
                    </div>
                    
                    {/* Name */}
                    <h3 className="text-xl md:text-2xl font-playfair font-bold mb-2 text-center">
                      {sponsor.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm md:text-base text-center mb-4 max-w-md">
                      {sponsor.description}
                    </p>
                    
                    {/* CTA Button */}
                    <Button 
                      size="sm" 
                      className="border border-gold bg-black/50 hover:bg-gold text-gold hover:text-white transition-all duration-300"
                    >
                      Saiba mais
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="flex justify-center mt-4">
            <CarouselPrevious className="relative static translate-y-0 -left-0 mr-2" />
            <CarouselNext className="relative static translate-y-0 -right-0 ml-2" />
          </div>
        </Carousel>
        
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
