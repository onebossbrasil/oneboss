
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { FormattedProduct } from "@/types/product";

type ProductGridProps = {
  products: FormattedProduct[];
  resetFilters: () => void;
};

const ProductGrid = ({ products, resetFilters }: ProductGridProps) => {
  return (
    <>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 md:py-16">
          <p className="text-md md:text-lg text-muted-foreground">Nenhum produto encontrado</p>
          <Button 
            variant="outline" 
            className="mt-4 border-gold/30 text-gold"
            onClick={resetFilters}
          >
            Limpar filtros
          </Button>
        </div>
      )}
      
      {/* Paginação */}
      {products.length > 0 && (
        <div className="mt-10 md:mt-12 flex justify-center">
          <div className="flex space-x-2">
            <Button variant="outline" disabled className="text-muted-foreground text-sm h-8 w-8 p-0">
              1
            </Button>
            <Button variant="ghost" className="text-sm h-8 w-8 p-0">2</Button>
            <Button variant="ghost" className="text-sm h-8 w-8 p-0">3</Button>
            <Button variant="ghost" className="text-sm h-8 w-8 p-0">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductGrid;
