
import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import CategoryBanners from "../components/CategoryBanners";
import FeaturedProducts from "../components/FeaturedProducts";
import WhyChooseUs from "../components/WhyChooseUs";
import SponsorsBanner from "../components/SponsorsBanner";
import ContactForm from "../components/ContactForm";
import NewsletterSignup from "../components/NewsletterSignup";

const Index = () => {
  useEffect(() => {
    document.title = "Loja Premium - Produtos de Luxo";
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <CategoryBanners />
        <FeaturedProducts />
        <WhyChooseUs />
        <SponsorsBanner />
        <ContactForm />
        <NewsletterSignup />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
