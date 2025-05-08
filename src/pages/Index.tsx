
import { Car, Home as HomeIcon, Anchor, Plane, Watch, Paintbrush } from "lucide-react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryBanners from "@/components/CategoryBanners";
import FeaturedProducts from "@/components/FeaturedProducts";
import SponsorsBanner from "@/components/SponsorsBanner";
import WhyChooseUs from "@/components/WhyChooseUs";
import Footer from "@/components/Footer";
import { useIsMobile } from "@/hooks/use-mobile";

// This file doesn't need to pass categories to CategoryBanners anymore
// since we've moved the data directly into the CategoryBanners component
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
