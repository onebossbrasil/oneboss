
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useRef } from "react";

// Substitua pelo caminho correto dos arquivos enviados!
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

const PartnersCarousel = () => {
  // Duplicamos os logos para efeito de loop perfeito visual
  const logos = [...partners, ...partners];
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: "start", 
    dragFree: true,
    speed: 2, // transição rápida e contínua
  });
  const autoScrollRef = useRef<NodeJS.Timeout>();

  // Autoplay suave (scroll + reset) para efeito de loop
  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.scrollTo(0);

    function autoScroll() {
      if (!emblaApi) return;
      emblaApi.scrollBy(1); // rola 1 pixel por tick
    }
    autoScrollRef.current = setInterval(autoScroll, 20);

    return () => {
      if(autoScrollRef.current) clearInterval(autoScrollRef.current);
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
