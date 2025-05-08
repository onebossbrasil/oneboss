import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductItem from "./ProductItem";
import { type Product } from "@/data/featuredProducts";
import "./productSlider.css";

type ProductSliderProps = {
  products: Product[];
};

const ProductSlider = ({ products }: ProductSliderProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  
  const checkScrollButtons = () => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  // Auto scroll functionality with infinite loop
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;
    
    const autoScrollInterval = 5000; // 5 seconds between scrolls
    const scrollAmount = 320; // Adjusted to show partial view of next product
    
    // Auto scroll function with infinite loop
    const autoScroll = () => {
      if (isPaused) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = scrollElement;
      
      // If we're at the end, scroll back to the beginning
      if (scrollLeft >= scrollWidth - clientWidth - 5) {
        scrollElement.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        // Otherwise, scroll forward
        scrollElement.scrollTo({
          left: scrollLeft + scrollAmount,
          behavior: "smooth",
        });
      }
      checkScrollButtons();
    };
    
    // Set up auto scroll timer
    const timer = setInterval(autoScroll, autoScrollInterval);
    
    // Pause auto scroll on mouse enter
    const handleMouseEnter = () => setIsPaused(true);
    const handleMouseLeave = () => setIsPaused(false);
    
    scrollElement.addEventListener("mouseenter", handleMouseEnter);
    scrollElement.addEventListener("mouseleave", handleMouseLeave);
    scrollElement.addEventListener("scroll", checkScrollButtons);
    
    checkScrollButtons();
    
    return () => {
      clearInterval(timer);
      scrollElement.removeEventListener("mouseenter", handleMouseEnter);
      scrollElement.removeEventListener("mouseleave", handleMouseLeave);
      scrollElement.removeEventListener("scroll", checkScrollButtons);
    };
  }, [isPaused]);

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
    <div className="relative">
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
      
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-6 pb-4 scrollbar-none"
        style={{ 
          scrollbarWidth: "none", 
          scrollSnapType: "x mandatory"  // Smooth snap effect
        }}
      >
        {products.map((product) => (
          <div 
            key={product.id}
            className="flex-shrink-0 product-slide" 
            style={{
              width: "calc((100% - 32px) / 2)", // 2 cards on mobile with gap
              maxWidth: "calc((100% - 32px) / 2)" // 2 cards on mobile with gap
            }}
          >
            <ProductItem product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSlider;
