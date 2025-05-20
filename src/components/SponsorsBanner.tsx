
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import useEmblaCarousel from "embla-carousel-react";

const AUTO_PLAY_INTERVAL = 3500; // 3.5s

const SponsorsBanner = () => {
  const isMobile = useIsMobile();
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Embla carrossel com loop infinito
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    slidesToScroll: 1,
  });
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // Busca parceiros visíveis do Supabase
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

  // Autoplay: avança 1 a cada intervalo
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

  // Duplicação se só houver 2 para looping perfeito
  const displayPartners = partners.length === 2 ? [...partners, ...partners] : partners;

  // Se não houver parceiros, exiba nada ou skeleton
  if (!loading && displayPartners.length === 0) return null;

  return (
    <section className="py-6 md:py-8 bg-background border-t border-gold/10 overflow-hidden">
      <div className={isMobile ? "" : "container mx-auto px-4"}>
        <div className="text-center mb-6 px-4">
          <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-2">
            Parceiros <span className="text-gold"></span>
          </h2>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-muted-foreground">
            Marcas de excelência que compartilham nossa paixão por qualidade e exclusividade
          </p>
        </div>

        <div
          ref={emblaRef}
          className="relative w-full h-[320px] md:h-[340px] embla overflow-hidden"
        >
          <div className="flex h-full embla__container">
            {displayPartners.map((partner, idx) => (
              <div
                className="embla__slide flex items-center justify-center min-w-0 w-full h-full relative"
                style={{
                  minWidth: "100%",
                  maxWidth: "100%",
                }}
                key={partner.id + "-" + idx}
              >
                {/* Banner image */}
                {partner.banner_image_url ? (
                  <img
                    src={partner.banner_image_url}
                    alt={partner.name || ""}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="bg-gray-200 w-full h-full absolute inset-0" />
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30" />

                {/* Content overlay - centralizado */}
                <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4">
                  {/* Logo em glassmorphism com destaque */}
                  {partner.logo_url && (
                    <div className="mb-4 flex items-center justify-center w-fit h-fit">
                      <div
                        className="glassmorphism rounded-xl p-2 md:p-3"
                        style={{
                          background: "rgba(255,255,255,0.22)", // Mais transparente
                          backdropFilter: "blur(10px)",
                          border: "1.5px solid rgba(255,255,255,0.13)",
                        }}
                      >
                        <img
                          src={partner.logo_url}
                          alt={partner.name || ""}
                          className="w-40 md:w-52 h-auto object-contain"
                          style={{
                            filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.09))",
                            maxHeight: 90,
                            maxWidth: 220,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Descrição centralizada */}
                  <p className="text-base md:text-lg text-center mb-4 max-w-md font-medium text-white drop-shadow">
                    {partner.description}
                  </p>

                  {/* Botão Saiba mais */}
                  {partner.link && (
                    <Button
                      size="sm"
                      asChild
                      className="bg-white/30 backdrop-blur-md border border-white/20 text-white font-medium px-8 py-2.5 rounded-md transition-all duration-300 shadow-lg hover:bg-white/40"
                    >
                      <a
                        href={partner.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        Saiba Mais
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>
        {`
          .embla__container {
            will-change: transform;
            height: 100%;
          }
          .embla__slide {
            transition: min-width 0.2s, max-width 0.2s;
          }
        `}
      </style>
    </section>
  );
};

export default SponsorsBanner;

