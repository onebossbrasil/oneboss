
import React, { useCallback, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";

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

const AUTO_PLAY_INTERVAL = 2500;

const PartnersCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    slidesToScroll: 1,
    speed: 6, // smoothness of the slide
    align: "start",
  });
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // Autoplay: avança 1 logo a cada intervalo
  const autoplay = useCallback(() => {
    if (!emblaApi) return;
    if (emblaApi.canScrollNext()) {
      emblaApi.scrollNext();
    } else {
      emblaApi.scrollTo(0);
    }
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    autoplayRef.current = setInterval(autoplay, AUTO_PLAY_INTERVAL);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [emblaApi, autoplay]);

  // Se houver 2 logos, sempre duplica para garantir looping fluido
  const displayPartners = partners.length === 2
    ? [...partners, ...partners]
    : partners;

  return (
    <section className="w-full bg-background py-6 md:py-8 relative overflow-hidden border-b border-gold/10">
      <div className="container mx-auto">
        <h2 className="font-playfair text-center text-xl md:text-2xl mb-6 font-bold text-muted-foreground tracking-wide">
          Nossos Parceiros
        </h2>
        <div className="w-full">
          <div ref={emblaRef} className="embla overflow-hidden">
            <div className="embla__container flex">
              {displayPartners.map((logo, idx) => (
                <div
                  className="embla__slide flex items-center justify-center flex-shrink-0 px-4"
                  style={{
                    minWidth: "50%", // sempre 2 visíveis incluso mobile/desktop
                    maxWidth: "50%",
                  }}
                  key={idx}
                >
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
        .embla__container {
          will-change: transform;
        }
        `}
      </style>
    </section>
  );
};

export default PartnersCarousel;

