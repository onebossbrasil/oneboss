import { Link } from "react-router-dom";
import { FormattedProduct } from "@/types/product";

type ProductItemProps = {
  product: FormattedProduct;
};

const ProductItem = ({ product }: ProductItemProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(price);
  };

  return (
    <Link
      key={product.id}
      to={`/produto/${product.slug || product.id}`}
      className="product-card h-full block"
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
  );
};

export default ProductItem;
