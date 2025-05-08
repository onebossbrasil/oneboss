
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=1920&h=800)' }}
      >
        <div className="absolute inset-0 hero-gradient"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto h-full flex flex-col justify-center px-6 md:px-12">
        <div className="max-w-xl animate-fade-in">
          <div className="mb-2 inline-block">
            <div className="glassmorphism px-4 py-1 rounded-full text-sm uppercase tracking-wider text-gold">
              Marketplace de Elite
            </div>
          </div>
          
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            ONE<span className="text-gold mx-1">✦</span>BOSS
          </h1>
          
          <p className="text-white/90 text-lg md:text-xl mb-8 max-w-md">
            Seu marketplace de itens exclusivos e ultra premium para quem busca o extraordinário.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button asChild className="bg-gold hover:bg-gold-light text-white border-none btn-hover-effect">
              <Link to="/categories">
                Explorar categorias
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 btn-hover-effect">
              <Link to="/featured">
                Produtos em destaque
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
