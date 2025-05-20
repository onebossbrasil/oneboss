import React, { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { supabase } from "@/integrations/supabase/client";

// Atente-se: hook simplificado para checar se é mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 768 : false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
}

const AUTO_PLAY_INTERVAL = 2500;

const PartnersCarousel = () => {
  const isMobile = useIsMobile();
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Embla config depende do tipo de device
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    slidesToScroll: 1,
    align: isMobile ? "center" : "start",
  });
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // Busca parceiros do banco (para o carrossel: todos visíveis)
  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("partners")
        .select("*")
        .eq("visible", true)
        .order("order_index", { ascending: true });
      setPartners(data || []);
      setLoading(false);
    })();
  }, []);

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
    if (!emblaApi || partners.length === 0) return;
    autoplayRef.current = setInterval(autoplay, AUTO_PLAY_INTERVAL);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [emblaApi, autoplay, partners.length]);

  // Duplicação dos logos se só houver 2, para looping suave
  const displayPartners = partners.length === 2 ? [...partners, ...partners] : partners;

  return (
    <section className="w-full bg-background py-5 md:py-8 relative overflow-hidden border-b border-gold/10">
      <div className="container mx-auto px-0 md:px-6">
        <h2 className="font-playfair text-center text-xl md:text-2xl mb-6 font-bold text-muted-foreground tracking-wide">Parceiros</h2>
        <div className="w-full">
          <div ref={emblaRef} className="embla overflow-hidden">
            <div className="embla__container flex">
              {displayPartners.length === 0 && !loading && <div className="text-center w-full text-muted-foreground py-8">Nenhum parceiro cadastrado</div>}
              {displayPartners.map((partner, idx) => (
                <div
                  className={`
                    embla__slide flex items-center justify-center flex-shrink-0 
                    px-1 md:px-6
                  `}
                  style={{
                    minWidth: isMobile ? "100%" : "50%",
                    maxWidth: isMobile ? "100%" : "50%",
                    transition: "min-width 0.2s, max-width 0.2s"
                  }}
                  key={partner.id + "-" + idx}
                >
                  <img src={partner.logo_url} alt={partner.name || ""} className={`
                      object-contain saturate-150 transition-transform duration-300 hover:scale-105
                      h-20 max-w-[180px]
                      md:h-32 md:max-w-[280px]
                    `} draggable={false} />
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
