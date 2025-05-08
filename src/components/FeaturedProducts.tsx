
import { featuredProducts } from "@/data/featuredProducts";
import ProductSlider from "./featured/ProductSlider";

const FeaturedProducts = () => {
  return (
    <section className="py-16 px-4 md:px-8 container mx-auto">
      <ProductSlider products={featuredProducts} />
    </section>
  );
};

export default FeaturedProducts;
