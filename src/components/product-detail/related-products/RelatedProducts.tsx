
import { useRelatedProducts } from "./useRelatedProducts";
import RelatedProductsList from "./RelatedProductsList";

interface RelatedProductsProps {
  currentProductId: string;
  categoryId: string | null;
}

const RelatedProducts = ({ currentProductId, categoryId }: RelatedProductsProps) => {
  const { relatedProducts, isLoading } = useRelatedProducts(currentProductId, categoryId);
  
  return (
    <RelatedProductsList 
      products={relatedProducts} 
      isLoading={isLoading} 
    />
  );
};

export default RelatedProducts;
