
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from "@/components/ui/carousel";

const bannerImages = [
  "/lovable-uploads/ea5e00ad-4293-4c9d-b6a5-80a544366ed4.png",
  "/lovable-uploads/d31ae657-c225-4f14-b8b8-39eade59dd48.png",
  "/lovable-uploads/c0b49897-08c2-4312-88cf-df7567ba1def.png"
];

const StoreBanner = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  // Atualiza o índice do slide atual quando o carrossel muda
  useEffect(() => {
    if (!api) return;
    const onChange = () => setActiveIndex(api.selectedScrollSnap());
    api.on("select", onChange);
    onChange();
    return () => {
      api.off("select", onChange);
    };
  }, [api]);

  // Troca automática dos slides
  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      if (activeIndex < bannerImages.length - 1) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [api, activeIndex]);

  return (
    <div className="relative h-[45vh] md:h-[65vh] min-h-[350px] md:min-h-[480px] w-full overflow-hidden">
      {/* Carrossel de fundos */}
      <Carousel className="absolute inset-0 w-full h-full" setApi={setApi} opts={{ loop: true }}>
        <CarouselContent className="h-full w-full m-0 p-0">
          {bannerImages.map((image, index) => (
            <CarouselItem key={index} className="h-full w-full p-0 overflow-hidden">
              <div className="relative w-full h-full">
                <img
                  src={image}
                  alt={`Banner slide ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/60" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Indicadores de slide */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {bannerImages.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                activeIndex === index ? "bg-gold" : "bg-white/40"
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>

      {/* Texto central */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
        <h1 className="font-playfair text-3xl md:text-5xl font-bold text-white mb-3 md:mb-4 text-center drop-shadow-lg">
          Loja <span className="text-gold">Exclusiva</span>
        </h1>
        <p className="text-white/80 max-w-xl mx-auto text-sm md:text-base text-center drop-shadow">
          Descubra produtos exclusivos selecionados para uma experiência extraordinária
        </p>
      </div>
    </div>
  );
};

export default StoreBanner;
