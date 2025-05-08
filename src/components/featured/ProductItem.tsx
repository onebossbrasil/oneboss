
import { Link } from "react-router-dom";

type Product = {
  id: number;
  name: string;
  price: string;
  category: string;
  imageUrl: string;
};

type ProductItemProps = {
  product: Product;
};

const ProductItem = ({ product }: ProductItemProps) => {
  return (
    <Link
      key={product.id}
      to={`/product/${product.id}`}
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
        <p className="text-gold font-semibold mt-1">{product.price}</p>
      </div>
    </Link>
  );
};

export default ProductItem;
