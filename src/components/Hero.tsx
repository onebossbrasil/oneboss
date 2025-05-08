
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative h-[85vh] min-h-[650px] w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&q=80&w=2070)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto h-full flex flex-col justify-center px-6 md:px-12">
        <div className="max-w-xl animate-fade-in">
          <div className="mb-4 inline-block">
            <div className="glassmorphism px-4 py-1 rounded-full text-sm uppercase tracking-wider text-gold">
              Experiência Ultra Premium
            </div>
          </div>
          
          <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            O melhor do <span className="text-gold">luxo</span> em um só lugar
          </h1>
          
          <p className="text-white/90 text-lg md:text-xl mb-10 max-w-md leading-relaxed">
            Acesso exclusivo aos produtos mais sofisticados e experiências extraordinárias para quem valoriza o excepcional.
          </p>
          
          <div className="flex flex-wrap gap-5">
            <Button asChild className="bg-gold hover:bg-gold-light text-white border-none btn-hover-effect text-base px-8 py-6 h-auto">
              <Link to="/loja">
                Explorar coleção <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 btn-hover-effect text-base px-8 py-6 h-auto">
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
