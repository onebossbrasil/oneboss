import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const SponsorsBanner = () => {
  const isMobile = useIsMobile();
  const [partner, setPartner] = useState<any>(null);

  useEffect(() => {
    // Busca o parceiro do topo (order_index=0 e visible)
    supabase
      .from("partners")
      .select("*")
      .eq("visible", true)
      .order("order_index", { ascending: true })
      .limit(1)
      .then(({ data }) => {
        if (data && data[0]) setPartner(data[0]);
      });
  }, []);

  if (!partner) {
    return null; // Ou mostrar skeleton/loading
  }

  return (
    <section className="py-6 md:py-8 bg-background border-t border-gold/10">
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
          className={`relative h-[300px] w-full overflow-hidden animate-slide-in-right flex items-center justify-center`}
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30"></div>

          {/* Content overlay - centralizado */}
          <div className="relative flex flex-col items-center justify-center z-10 px-4 w-full h-full">
            {/* Logo centralizada com glassmorphism */}
            {partner.logo_url && (
              <div className="mb-4 flex items-center justify-center w-fit h-fit">
                <div
                  className="glassmorphism rounded-xl p-2 md:p-3"
                  style={{
                    background: "rgba(255,255,255,0.25)", // MAIS TRANSPARENTE
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

            {/* Botão centralizado */}
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
      </div>
    </section>
  );
};

export default SponsorsBanner;
