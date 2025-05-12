
import { Link } from "react-router-dom";
import { 
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormattedProduct } from "@/types/product";
import RelatedProductItem from "./RelatedProductItem";
import RelatedProductsLoader from "./RelatedProductsLoader";

interface RelatedProductsListProps {
  products: FormattedProduct[];
  isLoading: boolean;
}

const RelatedProductsList = ({ products, isLoading }: RelatedProductsListProps) => {
  if (isLoading) {
    return <RelatedProductsLoader />;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <Card className="my-8">
      <CardHeader>
        <CardTitle>Produtos Relacionados</CardTitle>
      </CardHeader>
      <CardContent>
        <Carousel
          opts={{
            align: "start",
            loop: products.length > 3,
          }}
          className="w-full"
        >
          <CarouselContent>
            {products.map((product) => (
              <RelatedProductItem key={product.id} product={product} />
            ))}
          </CarouselContent>
          {products.length > 4 && (
            <>
              <CarouselPrevious className="-left-4 md:-left-5" />
              <CarouselNext className="-right-4 md:-right-5" />
            </>
          )}
        </Carousel>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link 
          to="/loja" 
          className="text-sm text-primary hover:underline"
        >
          Ver todos os produtos
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RelatedProductsList;
