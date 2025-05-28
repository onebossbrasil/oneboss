
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
          className="group animate-fade-in"
        >
          <Card className="h-full overflow-hidden border hover:border-gold/30 hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
            <div className="relative">
              <AspectRatio ratio={4/3}>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </AspectRatio>
              
              {product.salePrice && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-sm shadow-md">
                  OFERTA
                </span>
              )}
            </div>
            
            <CardContent className="p-3 md:p-4">
              <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-gold transition-colors mb-2 leading-tight">
                {product.name}
              </h3>
              
              <div className="mt-auto">
                {product.salePrice ? (
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground line-through">
                      {product.price}
                    </span>
                    <span className="font-bold text-red-600 text-lg">
                      {product.salePrice}
                    </span>
                  </div>
                ) : (
                  <span className="font-bold text-lg text-gold">
                    {product.price}
                  </span>
                )}
              </div>
              
              {product.category && (
                <div className="mt-2 text-xs text-muted-foreground uppercase tracking-wide">
                  {product.category}
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
