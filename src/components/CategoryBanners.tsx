import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card } from "@/components/ui/card";
const categoryData = [{
  id: 1,
  title: "AUTOMÓVEIS",
  image: "/lovable-uploads/b105ff99-4dec-4198-839a-a2e4e3dc70e9.png",
  slug: "automoveis",
  size: "full" as const
}, {
  id: 2,
  title: "EMBARCAÇÕES",
  image: "/lovable-uploads/0117fa13-5bd6-4cff-9624-3f067a1761a6.png",
  slug: "embarcacoes",
  size: "half" as const
}, {
  id: 3,
  title: "AERONAVES",
  image: "/lovable-uploads/3b5c8e74-80cb-4b62-b27a-2ac9cbc286ab.png",
  slug: "aeronaves",
  size: "half" as const
}, {
  id: 4,
  title: "IMÓVEIS",
  image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200&h=600",
  slug: "imoveis",
  size: "full" as const
}, {
  id: 5,
  title: "RELÓGIOS",
  image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&q=80&w=1200&h=600",
  slug: "relogios",
  size: "half" as const
}, {
  id: 6,
  title: "DECORAÇÃO",
  image: "/lovable-uploads/9f54a112-58fa-494d-bea2-08df57c01fec.png",
  slug: "decoracao",
  size: "half" as const
}];
const CategoryBanners = () => {
  const isMobile = useIsMobile();
  return <section className="py-6 md:py-8 bg-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
      
      <div className="px-[46px] mx-0 py-[35px] rounded-none">
        <div className="text-center mb-6 md:mb-8 px-4">
          <h2 className="font-playfair text-3xl md:text-5xl font-bold mb-4">
            Categorias 
          </h2>
          <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-gold/40 via-gold to-gold/40 mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-sm md:text-lg text-muted-foreground">
            Explore nossas coleções exclusivas e descubra produtos que refletem excelência, sofisticação e exclusividade
          </p>
        </div>
        
        <div className={`grid grid-cols-1 md:grid-cols-2 ${!isMobile ? "gap-4" : "gap-0"}`}>
          {categoryData.map(category => <Link key={category.id} to={`/loja?categoria=${category.slug}`} className={`${isMobile ? "animate-slide-in-right" : category.size === "full" ? "md:col-span-2 animate-scale-in" : "animate-scale-in"} group relative overflow-hidden`}>
              <div className="h-[300px] w-full relative">
                {/* Full coverage background image */}
                <img src={category.image} alt={category.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                
                {/* Dark overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                
                {/* Position the content at the bottom with padding */}
                <div className="absolute inset-0 flex items-end justify-center pb-6">
                  <div className="glassmorphism text-center px-6 py-4 rounded-lg backdrop-blur-md bg-white/10 border border-white/30 shadow-lg transform transition-all duration-500 group-hover:bg-white/15">
                    <h3 className="text-white font-playfair text-xl md:text-3xl font-bold mb-2 tracking-wide">
                      {category.title}
                    </h3>
                    
                    <div className="mt-3">
                      <span className="inline-block px-4 py-1.5 text-sm md:text-base rounded-full border border-gold/50 text-white transition-colors duration-300 group-hover:border-gold group-hover:text-gold">
                        VER MAIS
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>
            </Link>)}
        </div>
        
        <div className="mt-6 md:mt-8 flex justify-center px-4">
          <Link to="/loja" className="border border-gold bg-transparent text-gold hover:bg-gold hover:text-white py-3 px-8 md:py-4 md:px-10 rounded-lg font-medium transition-all duration-300 flex items-center group">
            <span>Ver todas as categorias</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>;
};
export default CategoryBanners;