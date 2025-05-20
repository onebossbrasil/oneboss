
import React from "react";

const partners = [
  {
    src: "/lovable-uploads/b7e62f9a-c9ae-4ee0-aa89-a90fa93912f0.png",
    alt: "EUROFIX - Manutenção & Performance"
  },
  {
    src: "/lovable-uploads/5bff8c7e-d3d1-45b9-8a6a-1fe67277ee72.png",
    alt: "AUTOMATIZE"
  },
];

const PartnersCarousel = () => {
  // Duplicar os itens para criar efeito de loop contínuo
  const logos = [...partners, ...partners];
  return (
    <section className="w-full bg-background py-6 md:py-8 relative overflow-hidden border-b border-gold/10">
      <div className="container mx-auto">
        <h2 className="font-playfair text-center text-xl md:text-2xl mb-6 font-bold text-muted-foreground tracking-wide">Nossos Parceiros</h2>
        <div className="w-full relative">
          <div className="h-24 md:h-32 overflow-hidden">
            <div
              className="flex gap-12 md:gap-24 animate-partner-marquee items-center h-full"
              style={{
                animationDuration: "18s",
                animationTimingFunction: "linear",
                animationIterationCount: "infinite"
              }}
            >
              {logos.map((logo, idx) => (
                <div className="flex-shrink-0 flex items-center h-full" key={idx}>
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="h-14 md:h-20 object-contain max-w-[180px] saturate-150 transition-transform duration-300 hover:scale-105"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>
        {`
        @keyframes partner-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-partner-marquee {
          width: 200%;
          animation-name: partner-marquee;
        }
        `}
      </style>
    </section>
  );
};

export default PartnersCarousel;
