
import { Car, Home as HomeIcon, Anchor, Plane, Watch, Paintbrush } from "lucide-react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryBanners from "@/components/CategoryBanners";
import FeaturedProducts from "@/components/FeaturedProducts";
import SponsorsBanner from "@/components/SponsorsBanner";
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
        <CategoryBanners />
        <FeaturedProducts />
        <SponsorsBanner />
        <WhyChooseUs />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
