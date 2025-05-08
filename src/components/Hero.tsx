
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Hero = () => {
  const isMobile = useIsMobile();
  
  return (
    <section className="relative h-[70vh] md:h-[85vh] min-h-[550px] md:min-h-[650px] w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&q=80&w=2070)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/50"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto h-full flex flex-col justify-center px-4 md:px-6 lg:px-12">
        <div className="max-w-xl animate-fade-in">
          <div className="mb-3 md:mb-4 inline-block">
            <div className="glassmorphism px-3 py-1 md:px-4 md:py-1 rounded-full text-xs md:text-sm uppercase tracking-wider text-gold">
              Experiência Ultra Premium
            </div>
          </div>
          
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
            O melhor do <span className="text-gold">luxo</span> em um só lugar
          </h1>
          
          <p className="text-white/90 text-sm md:text-lg lg:text-xl mb-6 md:mb-10 max-w-md leading-relaxed">
            Acesso exclusivo aos produtos mais sofisticados e experiências extraordinárias para quem valoriza o excepcional.
          </p>
          
          <div className="flex flex-wrap gap-3 md:gap-5">
            <Button asChild className="bg-gold hover:bg-gold-light text-white border-none btn-hover-effect text-sm md:text-base px-6 py-2 md:px-8 md:py-6 h-auto">
              <Link to="/loja">
                Explorar coleção <ChevronRight className="ml-1 md:ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 btn-hover-effect text-sm md:text-base px-6 py-2 md:px-8 md:py-6 h-auto">
              <Link to="/sobre">
                Conheça a One Boss
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
