import React from "react";

const StoreBanner = () => {
  return (
    <div className="w-full relative h-[110px] md:h-[170px] flex items-center justify-center bg-gradient-to-br from-gold/80 via-gold/40 to-muted rounded-b-3xl mb-0 shadow-lg overflow-hidden">
      <img
        src="/lovable-uploads/ea5e00ad-4293-4c9d-b6a5-80a544366ed4.png"
        alt="Banner loja - Lamborghini"
        className="absolute inset-0 object-cover w-full h-full opacity-35 z-0"
        draggable={false}
      />
    </div>
  );
};

export default StoreBanner;
