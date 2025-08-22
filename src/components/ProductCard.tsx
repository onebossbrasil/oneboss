import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { FormattedProduct } from "@/types/product";

type ProductCardProps = {
  product: FormattedProduct;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const isMobile = useIsMobile();
  
  const formatPrice = (price: number | null) => {
    if (price === null) return "Preço não disponível";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };
  
  return (
    <Link 
      to={`/produto/${product.slug || product.id}`} 
      className="group block animate-scale-in"
    >
      <div className="product-card h-full flex flex-col">
        <div className="relative aspect-[3/2] md:aspect-[4/3] rounded-t-xl overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute top-2 md:top-3 right-2 md:right-3 z-10">
            <Badge className="bg-gold text-white hover:bg-gold-dark border-none text-xs md:text-sm">
              {product.subcategory}
            </Badge>
          </div>
          {product.featured && (
            <div className="absolute bottom-2 md:bottom-3 left-2 md:left-3">
              <Badge variant="outline" className="bg-black/70 border-gold/50 text-gold text-xs uppercase tracking-wider">
                Destaque
              </Badge>
            </div>
          )}
        </div>
        
        <div className="glassmorphism rounded-b-xl p-3 md:p-4 flex-grow flex flex-col">
          <h3 className="font-playfair text-base md:text-lg font-medium mb-1 md:mb-2 group-hover:text-gold transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-4 line-clamp-2 flex-grow">
            {product.description}
          </p>
          <div className="mt-auto">
            {product.priceOnRequest ? (
              <p className="text-gold font-semibold text-sm md:text-base">
                Sob Consulta
              </p>
            ) : (
              <p className="text-gold font-semibold text-sm md:text-base">
                {formatPrice(product.price)}
                {product.salePrice && (
                  <span className="ml-2 text-xs text-muted-foreground line-through">
                    {formatPrice(product.salePrice)}
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
