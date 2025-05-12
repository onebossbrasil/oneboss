
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { FormattedProduct } from "@/types/product";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { CircleSlash, RefreshCw } from "lucide-react";

interface ProductGridProps {
  products: FormattedProduct[];
  resetFilters: () => void;
}

const ProductGrid = ({ products, resetFilters }: ProductGridProps) => {
  // If no products to display
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <CircleSlash className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
        <h3 className="mt-4 text-xl font-medium">Nenhum produto encontrado</h3>
        <p className="mt-2 text-muted-foreground">
          Não encontramos produtos correspondentes aos filtros aplicados.
        </p>
        <Button onClick={resetFilters} variant="outline" className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Limpar filtros
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link 
          key={product.id} 
          to={`/produto/${product.id}`} 
          className="group"
        >
          <Card className="h-full overflow-hidden border hover:border-primary transition-colors duration-200">
            <div className="relative">
              {/* Product Image */}
              <AspectRatio ratio={4/3}>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </AspectRatio>
              
              {/* Sale Badge */}
              {product.salePrice && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-sm">
                  OFERTA
                </span>
              )}
            </div>
            
            <CardContent className="p-4">
              {/* Product Name */}
              <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              
              {/* Price Display */}
              <div className="mt-2">
                {product.salePrice ? (
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground line-through">
                      {product.price}
                    </span>
                    <span className="font-bold text-red-600">
                      {product.salePrice}
                    </span>
                  </div>
                ) : (
                  <span className="font-bold">
                    {product.price}
                  </span>
                )}
              </div>
              
              {/* Category */}
              {product.category && (
                <div className="mt-2 text-xs text-muted-foreground">
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
