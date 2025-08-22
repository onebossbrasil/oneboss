import { useFeaturedProducts } from "@/contexts/product/FeaturedProductProvider";
import ProductSlider from "./featured/ProductSlider";
import { useCategories } from "@/contexts/CategoryContext";
import { FormattedProduct } from "@/types/product";

const FeaturedProducts = () => {
  const { featuredProducts, isLoading } = useFeaturedProducts();
  const { categories } = useCategories();

  // Adiciona log de diagnóstico da home
  if (featuredProducts && featuredProducts.length > 0) {
    console.log("[Home] Produtos em destaque recebidos:", featuredProducts.map((p) => ({
      id: p.id, nome: p.name, published: p.published, featured: p.featured
    })));
  } else {
    console.log("[Home] Nenhum produto em destaque foi recebido.");
  }

  // Format products for the slider
  const formattedProducts: FormattedProduct[] = featuredProducts.map(product => ({
    id: product.id,
    name: product.name,
    price: product.priceOnRequest ? null : Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : undefined,
    category: categories.find(cat => cat.id.toString() === product.categoryId)?.name || '',
    imageUrl: product.images.length > 0 ? product.images[0].url : 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600&h=400',
    featured: product.featured,
    description: product.description,
    priceOnRequest: product.priceOnRequest
  }));

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-transparent to-zinc-50 dark:to-zinc-900/50">
      <div className="container mx-auto px-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando produtos em destaque...</p>
          </div>
        ) : formattedProducts.length > 0 ? (
          <ProductSlider products={formattedProducts} />
        ) : (
          <div className="text-center py-12">
            <h2 className="font-playfair text-3xl font-bold mb-4">Produtos em Destaque</h2>
            <p className="text-muted-foreground">
              Nenhum produto em destaque encontrado. Adicione produtos com a opção "Destaque" ativada.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
