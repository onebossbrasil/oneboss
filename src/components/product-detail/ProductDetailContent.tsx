
import { Product } from "@/types/product";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductDescription from "./ProductDescription";
import ProductAdditionalInfo from "./ProductAdditionalInfo";
import RelatedProducts from "./related-products";
import ProductBreadcrumbs from "./ProductBreadcrumbs";
import BackButton from "./BackButton";
// Removido: import ContactSection from "./ContactSection";

interface ProductDetailContentProps {
  product: Product;
  onGoBack: () => void;
}

const ProductDetailContent = ({ product, onGoBack }: ProductDetailContentProps) => {
  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      {/* Back button and Breadcrumbs */}
      <div className="mb-6">
        <BackButton onClick={onGoBack} />
        <ProductBreadcrumbs product={product} />
      </div>
      
      {/* Product Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
        {/* Product Gallery */}
        <ProductGallery images={product.images} productName={product.name} />
        
        {/* Product Info */}
        <ProductInfo product={product} />
      </div>
      
      {/* Product Description and Details */}
      <ProductDescription product={product} />
      
      {/* Additional Information */}
      <ProductAdditionalInfo />
      
      {/* Related Products */}
      <RelatedProducts currentProductId={product.id} categoryId={product.categoryId} />
      
      {/* Sessão de Contato removida da página de produto individual */}
    </main>
  );
};

export default ProductDetailContent;

