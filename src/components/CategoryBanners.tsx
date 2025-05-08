
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";

const categoryData = [
  {
    id: 1,
    title: "AUTOMÓVEIS",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200&h=600",
    slug: "automoveis",
    size: "full" as const,
  },
  {
    id: 2,
    title: "EMBARCAÇÕES",
    image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=1200&h=600",
    slug: "embarcacoes",
    size: "half" as const,
  },
  {
    id: 3,
    title: "AERONAVES",
    image: "https://images.unsplash.com/photo-1543291322-8a5da9bea7b4?auto=format&fit=crop&q=80&w=1200&h=600",
    slug: "aeronaves",
    size: "half" as const,
  },
  {
    id: 4,
    title: "IMÓVEIS",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200&h=600",
    slug: "imoveis",
    size: "full" as const,
  },
  {
    id: 5,
    title: "RELÓGIOS",
    image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&q=80&w=1200&h=600",
    slug: "relogios",
    size: "half" as const,
  },
  {
    id: 6,
    title: "DECORAÇÃO",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1200&h=600",
    slug: "decoracao",
    size: "half" as const,
  },
];

const CategoryBanners = () => {
  const isMobile = useIsMobile();
  
  return (
    <section className="py-10 md:py-16 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-3 md:mb-4">
            Categorias <span className="text-gold">Premium</span>
          </h2>
          <div className="w-16 md:w-24 h-1 bg-gold mx-auto mb-4 md:mb-6"></div>
          <p className="max-w-2xl mx-auto text-sm md:text-lg text-muted-foreground">
            Explore nossas coleções exclusivas e descubra produtos que refletem excelência, sofisticação e exclusividade
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {categoryData.map((category) => (
            <Link
              key={category.id}
              to={`/loja?categoria=${category.slug}`}
              className={`group ${category.size === "full" ? "md:col-span-2" : ""} overflow-hidden rounded-lg transition-all duration-500`}
            >
              <div className="relative overflow-hidden h-full">
                <AspectRatio ratio={category.size === "full" ? 21/9 : isMobile ? 16/9 : 16/10}>
                  <div className="w-full h-full">
                    <img 
                      src={category.image} 
                      alt={category.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40"></div>
                    
                    {/* Glassmorphism container */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="glassmorphism text-center py-6 px-8 transform transition-all duration-500 group-hover:scale-105 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-2xl">
                        <h3 className="text-white font-playfair text-2xl md:text-3xl font-bold mb-3">
                          {category.title}
                        </h3>
                        <div className="inline-block bg-transparent border border-white/30 hover:border-gold text-white hover:text-gold rounded-full px-5 py-1 text-sm transition-all duration-300">
                          VER MAIS
                        </div>
                      </div>
                    </div>
                  </div>
                </AspectRatio>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-10 md:mt-16 flex justify-center">
          <Link 
            to="/loja" 
            className="border border-gold/30 hover:border-gold text-gold hover:bg-gold hover:text-white py-2 px-6 md:py-3 md:px-8 rounded-lg font-medium transition-all duration-300"
          >
            Ver todas as categorias
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryBanners;
