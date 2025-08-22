import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { FormattedProduct } from "@/types/product";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { CircleSlash, RefreshCw } from "lucide-react";

interface ProductGridProps {
  products: FormattedProduct[];
  resetFilters: () => void;
  isLoading?: boolean;
}

const ProductGrid = ({ products, resetFilters, isLoading = false }: ProductGridProps) => {
  const formatPrice = (price: number | null) => {
    if (price === null) return "Preço não disponível";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  if (products.length === 0 && !isLoading) {
    return (
      <div className="text-center py-16 px-4">
        <CircleSlash className="h-16 w-16 mx-auto text-muted-foreground opacity-50 mb-6" />
        <h3 className="text-xl md:text-2xl font-medium mb-3">Nenhum produto encontrado</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Não encontramos produtos correspondentes aos filtros aplicados. Tente ajustar seus critérios de busca.
        </p>
        <Button onClick={resetFilters} variant="outline" size="lg" className="border-gold text-gold hover:bg-gold/10">
          <RefreshCw className="h-4 w-4 mr-2" />
          Limpar filtros
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <Link 
          key={product.id} 
          to={`/produto/${product.id}`} 
          className="product-card h-full block animate-fade-in"
        >
          <div className="relative aspect-[4/3] rounded-t-lg overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute top-3 right-3 glassmorphism px-3 py-1 rounded-full text-xs uppercase tracking-wider">
              {product.category || product.subcategory}
            </div>
          </div>
          <div className="glassmorphism rounded-b-lg p-4">
            <h3 className="font-playfair font-medium text-lg mb-1 line-clamp-2 group-hover:text-gold transition-colors">
              {product.name}
            </h3>
            <div className="mt-1">
              {product.priceOnRequest ? (
                <span className="text-gold font-semibold">Sob Consulta</span>
              ) : (
                <>
                  {typeof product.salePrice === 'number' ? (
                    <>
                      <span className="text-gold font-semibold">
                        {formatPrice(product.salePrice)}
                      </span>
                      <span className="text-sm text-muted-foreground line-through ml-2">
                        {formatPrice(product.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-gold font-semibold">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
