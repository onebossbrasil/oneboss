
import { Car, Home as HomeIcon, Anchor, Plane, Watch, Paintbrush } from "lucide-react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import FeaturedProducts from "@/components/FeaturedProducts";
import WhyChooseUs from "@/components/WhyChooseUs";
import Footer from "@/components/Footer";

const categories = [
  {
    title: "Automóveis",
    icon: <Car size={32} />,
    slug: "automoveis",
  },
  {
    title: "Imóveis",
    icon: <HomeIcon size={32} />,
    slug: "imoveis",
  },
  {
    title: "Embarcações",
    icon: <Anchor size={32} />,
    slug: "embarcacoes",
  },
  {
    title: "Aeronaves",
    icon: <Plane size={32} />,
    slug: "aeronaves",
  },
  {
    title: "Relógios",
    icon: <Watch size={32} />,
    slug: "relogios",
  },
  {
    title: "Decoração",
    icon: <Paintbrush size={32} />,
    slug: "decoracao",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        
        {/* Categories Section */}
        <section className="py-16 px-4 md:px-8 container mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
              Categorias em Destaque
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Explore nossas categorias premium e encontre produtos exclusivos que refletem seu estilo de vida sofisticado.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.slug}
                title={category.title}
                icon={category.icon}
                slug={category.slug}
              />
            ))}
          </div>
        </section>
        
        <FeaturedProducts />
        <WhyChooseUs />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
