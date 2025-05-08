
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type Product = {
  id: number;
  name: string;
  price: string;
  category: string;
  imageUrl: string;
};

const productsData: Product[] = [
  {
    id: 1,
    name: "Mansão Beira-Mar",
    price: "R$ 12.500.000",
    category: "Imóveis",
    imageUrl: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&q=80&w=600&h=400",
  },
  {
    id: 2,
    name: "Porsche 911 Turbo S",
    price: "R$ 1.850.000",
    category: "Automóveis",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600&h=400",
  },
  {
    id: 3,
    name: "Iate Azimut 80",
    price: "R$ 8.200.000",
    category: "Embarcações",
    imageUrl: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=600&h=400",
  },
  {
    id: 4,
    name: "Rolex Daytona",
    price: "R$ 180.000",
    category: "Relógios",
    imageUrl: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=600&h=400",
  },
  {
    id: 5,
    name: "Escultura Exclusiva",
    price: "R$ 95.000",
    category: "Decoração",
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600&h=400",
  }
];

const FeaturedProducts = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    
    if (scrollElement) {
      scrollElement.addEventListener("scroll", checkScrollButtons);
      checkScrollButtons();
      
      return () => {
        scrollElement.removeEventListener("scroll", checkScrollButtons);
      };
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    
    const scrollAmount = 400;
    const newScrollLeft =
      direction === "left"
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;
    
    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-16 px-4 md:px-8 container mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-playfair text-3xl font-bold">Produtos em Destaque</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            disabled={!canScrollLeft}
            onClick={() => scroll("left")}
            className={`rounded-full ${
              canScrollLeft ? "hover:text-gold hover:border-gold" : "opacity-50"
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={!canScrollRight}
            onClick={() => scroll("right")}
            className={`rounded-full ${
              canScrollRight ? "hover:text-gold hover:border-gold" : "opacity-50"
            }`}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 pb-4 scrollbar-none"
          style={{ scrollbarWidth: "none" }}
        >
          {productsData.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="product-card min-w-[280px] md:min-w-[320px] flex-shrink-0"
            >
              <div className="relative aspect-[4/3] rounded-t-lg overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 glassmorphism px-3 py-1 rounded-full text-xs uppercase tracking-wider">
                  {product.category}
                </div>
              </div>
              <div className="glassmorphism rounded-b-lg p-4">
                <h3 className="font-playfair font-medium text-lg">{product.name}</h3>
                <p className="text-gold font-semibold mt-1">{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
