
import { Product } from "@/types/product";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductDescription from "./ProductDescription";
import ProductAdditionalInfo from "./ProductAdditionalInfo";
import RelatedProducts from "./related-products";
import ProductBreadcrumbs from "./ProductBreadcrumbs";
import BackButton from "./BackButton";
import MobileActionBar from "./MobileActionBar";
import { useIsMobile } from "@/hooks/useIsMobile";

interface ProductDetailContentProps {
  product: Product;
  onGoBack: () => void;
}

const ProductDetailContent = ({ product, onGoBack }: ProductDetailContentProps) => {
  const isMobile = useIsMobile();

  return (
    <main className="relative flex-1 w-full max-w-3xl md:max-w-6xl mx-auto px-0 md:px-4 py-2 md:py-8 animate-fade-in bg-gradient-to-br from-zinc-100 to-white dark:from-zinc-900 dark:to-zinc-950 rounded-t-3xl md:rounded-2xl shadow-xl">
      {/* Header Mobile/Top: Voltar + Breadcrumbs */}
      <div className="pt-4 pb-2 px-4 md:px-0">
        <div className="flex items-center gap-2">
          <BackButton onClick={onGoBack} />
          {/* Só mostra breadcrumbs desktop ou mobile largo */}
          <div className="hidden md:block flex-1">
            <ProductBreadcrumbs product={product} />
          </div>
        </div>
        {/* Breadcrumb móvel: abaixo do botão e mais discreto */}
        <div className="block md:hidden">
          <ProductBreadcrumbs product={product} />
        </div>
      </div>

      {/* Hero: Galeria + Infos principais */}
      <section className="flex flex-col md:flex-row gap-6 md:gap-10 px-0 md:px-2 mt-2">
        {/* Galeria (Mobile sempre acima, desktop à esquerda) */}
        <div className="w-full md:w-1/2">
          <ProductGallery images={product.images} productName={product.name} />
        </div>
        {/* Infos */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <ProductInfo product={product} />
        </div>
      </section>

      {/* Abas: Descrição & Especificações */}
      <section className="px-3 md:px-2">
        <ProductDescription product={product} />
      </section>

      {/* Informações Extras (Glass) */}
      <section className="px-3 md:px-2">
        <ProductAdditionalInfo />
      </section>

      {/* Relacionados */}
      <section className="px-3 md:px-2">
        <RelatedProducts currentProductId={product.id} categoryId={product.categoryId} />
      </section>

      {/* Barra extra fixa de ações principais só em mobile */}
      {isMobile && (
        <MobileActionBar product={product} />
      )}
    </main>
  );
};

export default ProductDetailContent;

