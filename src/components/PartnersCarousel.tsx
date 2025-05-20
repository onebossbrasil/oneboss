
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useRef } from "react";

// Logos dos parceiros
const partners = [
  {
    name: "Parceiro 1",
    logo: "/lovable-uploads/1048c280-9081-420f-a0a1-899e5e5ce851.png",
  },
  {
    name: "Parceiro 2",
    logo: "/lovable-uploads/94c4f913-0185-4aaa-b639-fa0e29e727ac.png",
  },
];

// Duplicar para efeito visual de loop/marquee
const logos = [...partners, ...partners];

const PartnersCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: true,
    // REMOVIDO: speed
  });
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.scrollTo(0);

    // Função para avançar para próximo slide
    const autoScroll = () => {
      if (!emblaApi) return;
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0); // Volta para o início se estiver no final
      }
    };

    autoScrollRef.current = setInterval(autoScroll, 1500); // Velocidade de rotação

    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [emblaApi]);

  return (
    <section className="relative bg-background px-0 py-4 md:py-6">
      <div className="w-full overflow-hidden" ref={emblaRef}>
        <div className="flex gap-10 md:gap-20 items-center" style={{minHeight: 72}}>
          {logos.map((partner, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center min-w-[120px] md:min-w-[160px] h-16 md:h-20 px-2"
              aria-label={partner.name}
            >
              <img
                src={partner.logo}
                alt={`Logo ${partner.name}`}
                className="h-10 md:h-14 max-w-[100px] md:max-w-[140px] object-contain drop-shadow"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersCarousel;
