
import React from "react";

const StoreBanner = () => {
  return (
    <div className="relative h-56 md:h-80 flex items-center justify-center overflow-hidden">
      {/* Imagem de fundo do carro de luxo */}
      <img
        src="/lovable-uploads/1048c280-9081-420f-a0a1-899e5e5ce851.png"
        alt="Banner Carro de Luxo"
        className="absolute inset-0 w-full h-full object-cover z-0"
        draggable={false}
      />
      {/* Sobreposição preta */}
      <div className="absolute inset-0 bg-black/70 z-10" />
      {/* Conteúdo centralizado */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full h-full">
        {/* Logo da Oneboss centralizada */}
        <img 
          src="/logo.svg"
          alt="Oneboss Logo"
          className="h-14 md:h-20 mb-4 drop-shadow-lg"
        />
        {/* Título */}
        <h1 className="font-playfair text-3xl md:text-5xl font-bold text-white mb-2 md:mb-3">
          Loja <span className="text-gold">Exclusiva</span>
        </h1>
      </div>
    </div>
  );
};

export default StoreBanner;
