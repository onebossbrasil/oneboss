
import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { FormattedProduct } from "@/types/product";
import { CarouselItem } from "@/components/ui/carousel";

interface RelatedProductItemProps {
  product: FormattedProduct;
}

const RelatedProductItem = ({ product }: RelatedProductItemProps) => {
  return (
    <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
      <Link to={`/produto/${product.id}`} className="block group">
        <div className="rounded-lg overflow-hidden border bg-white hover:shadow-md transition-shadow">
          <AspectRatio ratio={4/3} className="bg-muted">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          </AspectRatio>
          <div className="p-4">
            <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <div className="mt-2">
              {product.salePrice ? (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground line-through">
                    {product.price}
                  </div>
                  <div className="font-bold text-red-600">
                    {product.salePrice}
                  </div>
                </div>
              ) : (
                <div className="font-bold">
                  {product.price}
                </div>
              )}
            </div>
            {product.category && (
              <div className="mt-2 text-xs text-muted-foreground">
                {product.category}
              </div>
            )}
          </div>
        </div>
      </Link>
    </CarouselItem>
  );
};

export default RelatedProductItem;
