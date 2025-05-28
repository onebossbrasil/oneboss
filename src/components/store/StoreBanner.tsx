
import React from "react";

const StoreBanner = () => {
  return (
    <div className="w-full relative h-[220px] md:h-[340px] flex items-center justify-center bg-gradient-to-br from-gold/80 via-gold/40 to-muted rounded-b-3xl mb-0 shadow-lg overflow-hidden">
      <img
        src="/lovable-uploads/ea5e00ad-4293-4c9d-b6a5-80a544366ed4.png"
        alt="Banner loja - Lamborghini"
        className="absolute inset-0 object-cover w-full h-full opacity-35 z-0"
        draggable={false}
      />
      <div className="relative z-10 text-center">
        <h1 className="font-playfair text-white text-4xl md:text-6xl font-bold drop-shadow mb-2 tracking-tight uppercase">
          Loja
        </h1>
        <p className="text-white/90 max-w-lg mx-auto text-sm md:text-lg drop-shadow-sm">
          Explore nosso catálogo de produtos exclusivos. Filtre e encontre o que precisa!
        </p>
      </div>
    </div>
  );
};

export default StoreBanner;
