
import { useState } from "react";
import { Button } from "@/components/ui/button";

// Dados simulados dos patrocinadores
const sponsors = [
  {
    id: 1,
    name: "Luxury Motors",
    logo: "https://images.unsplash.com/photo-1622711443907-b27a8222f838?auto=format&fit=crop&q=80&w=200&h=100",
    url: "/parceiros/luxury-motors"
  },
  {
    id: 2,
    name: "Elite Properties",
    logo: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=200&h=100",
    url: "/parceiros/elite-properties"
  },
  {
    id: 3,
    name: "Royal Watches",
    logo: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=200&h=100",
    url: "/parceiros/royal-watches"
  },
  {
    id: 4,
    name: "Exclusive Yachts",
    logo: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=200&h=100",
    url: "/parceiros/exclusive-yachts"
  },
  {
    id: 5,
    name: "Premium Jets",
    logo: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=200&h=100",
    url: "/parceiros/premium-jets"
  },
];

const SponsorsBanner = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <section className="py-16 bg-background border-t border-gold/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-playfair text-3xl font-bold mb-4">
            Parceiros <span className="text-gold">Premium</span>
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Marcas de excelência que compartilham nossa paixão por qualidade e exclusividade
          </p>
        </div>
        
        <div 
          className="relative overflow-hidden rounded-xl glassmorphism py-12 px-8"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div 
            className={`flex items-center justify-between space-x-10 transition-transform duration-15000 ease-linear ${isHovered ? 'animate-none' : 'animate-[scroll_30s_linear_infinite]'}`}
          >
            {[...sponsors, ...sponsors].map((sponsor, index) => (
              <div 
                key={`${sponsor.id}-${index}`}
                className="flex-shrink-0 flex items-center justify-center h-24 w-40 p-4 glassmorphism rounded-lg hover:shadow-lg hover:shadow-gold/10 transition-all duration-300"
              >
                <img 
                  src={sponsor.logo} 
                  alt={sponsor.name} 
                  className="max-h-12 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>
          
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent z-10"></div>
        </div>
        
        <div className="mt-8 text-center">
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
