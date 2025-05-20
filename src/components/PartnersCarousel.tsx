
import React, { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

// Atente-se: hook simplificado para checar se é mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
}

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
  const isMobile = useIsMobile();

  // Embla config depende do tipo de device
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    slidesToScroll: 1,
    align: isMobile ? "center" : "start",
    // Não existe 'speed' option aqui
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

  // Duplicação dos logos se só houver 2, para looping suave
  const displayPartners = partners.length === 2
    ? [...partners, ...partners]
    : partners;

  return (
    <section className="w-full bg-[#1A1F2C] py-5 md:py-8 relative overflow-hidden border-b border-gold/10">
      <div className="container mx-auto px-0 md:px-6">
        <h2 className="font-playfair text-center text-xl md:text-2xl mb-6 font-bold text-muted-foreground tracking-wide">
          Nossos Parceiros
        </h2>
        <div className="w-full">
          <div ref={emblaRef} className="embla overflow-hidden">
            <div className="embla__container flex">
              {displayPartners.map((logo, idx) => (
                <div
                  className={`
                    embla__slide flex items-center justify-center flex-shrink-0 
                    px-1 md:px-6
                  `}
                  style={{
                    minWidth: isMobile ? "100%" : "50%",
                    maxWidth: isMobile ? "100%" : "50%",
                    transition: "min-width 0.2s, max-width 0.2s",
                  }}
                  key={idx}
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className={`
                      object-contain saturate-150 transition-transform duration-300 hover:scale-105
                      h-20 max-w-[180px]
                      md:h-32 md:max-w-[280px]
                    `}
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

