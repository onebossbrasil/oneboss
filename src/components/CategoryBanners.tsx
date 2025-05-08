
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const categoryData = [
  {
    id: 1,
    title: "Imóveis de Luxo",
    description: "Mansões, coberturas e propriedades exclusivas ao redor do mundo",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200&h=600",
    slug: "imoveis",
    position: "right" as const,
  },
  {
    id: 2,
    title: "Automóveis Premium",
    description: "Veículos de alto desempenho e design inigualável",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200&h=600",
    slug: "automoveis",
    position: "left" as const,
  },
  {
    id: 3,
    title: "Embarcações Exclusivas",
    description: "Iates e lanchas para experiências marítimas incomparáveis",
    image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=1200&h=600",
    slug: "embarcacoes",
    position: "right" as const,
  }
];

const CategoryBanners = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl font-bold mb-4">
            Categorias <span className="text-gold">Premium</span>
          </h2>
          <div className="w-24 h-1 bg-gold mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Explore nossas coleções exclusivas e descubra produtos que refletem excelência, sofisticação e exclusividade
          </p>
        </div>
        
        <div className="space-y-24">
          {categoryData.map((category) => (
            <div key={category.id} className="group relative overflow-hidden rounded-xl bg-background shadow-lg transform transition-all duration-500 hover:shadow-2xl">
              <div className="aspect-[2/1] w-full overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.title} 
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className={`absolute inset-0 bg-gradient-to-${category.position} from-black/80 to-transparent`}></div>
              </div>
              
              <div className={`absolute inset-0 flex items-center ${category.position === "right" ? "justify-end pr-16" : "justify-start pl-16"}`}>
                <div className={`max-w-md p-6 text-${category.position === "right" ? "right" : "left"}`}>
                  <h3 className="font-playfair text-3xl lg:text-4xl font-bold text-white mb-4">
                    {category.title}
                  </h3>
                  <p className="text-white/80 mb-6 text-lg">
                    {category.description}
                  </p>
                  <Link 
                    to={`/loja?categoria=${category.slug}`} 
                    className="inline-flex items-center text-gold hover:text-gold-light font-medium transition-colors group"
                  >
                    Explorar coleção
                    <ChevronRight className="ml-1 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 flex justify-center">
          <Link 
            to="/loja" 
            className="border border-gold/30 hover:border-gold text-gold hover:bg-gold hover:text-white py-3 px-8 rounded-lg font-medium transition-all duration-300"
          >
            Ver todas as categorias
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryBanners;
