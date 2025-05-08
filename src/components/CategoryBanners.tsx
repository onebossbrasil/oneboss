
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
          {categoryData.map((category) => (
            <Link
              key={category.id}
              to={`/loja?categoria=${category.slug}`}
              className={`${category.size === "full" ? "md:col-span-2" : ""} group rounded-xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-gold/20 block`}
            >
              <AspectRatio ratio={category.size === "full" ? 21/9 : isMobile ? 16/9 : 16/10} className="w-full h-full">
                <div className="relative w-full h-full overflow-hidden">
                  {/* Background Image */}
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-8">
                    <div className="glassmorphism rounded-xl p-4 md:p-6 transform transition-all duration-500 backdrop-blur-sm bg-white/10 border border-white/20 shadow-lg group-hover:scale-[1.02] w-fit mx-auto">
                      <h3 className="text-white font-playfair text-xl md:text-3xl font-bold text-center">
                        {category.title}
                      </h3>
                      
                      <div className="mt-3 flex justify-center">
                        <span className="inline-block px-4 py-1.5 rounded-full border border-white/30 text-white text-sm md:text-base transition-colors duration-300 group-hover:border-gold group-hover:text-gold">
                          Ver Coleção
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </AspectRatio>
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
