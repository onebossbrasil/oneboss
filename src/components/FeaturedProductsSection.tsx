import React from "react";
import { useProducts } from "@/contexts/ProductContext";
import { useCategories } from "@/contexts/CategoryContext";
import ProductSlider from "./featured/ProductSlider";
import { FormattedProduct } from "@/types/product";

type FeaturedProductsSectionProps = {
  title?: string;
  hideIfNone?: boolean;
  className?: string;
};

const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  title = "Produtos em Destaque",
  hideIfNone = false,
  className = "",
}) => {
  const { featuredProducts, isLoading } = useProducts();
  const { categories } = useCategories();

  const formattedProducts: FormattedProduct[] = featuredProducts.map(product => ({
    id: product.id,
    name: product.name,
    price: typeof product.price === 'number'
      ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)
      : product.price + "",
    salePrice: product.salePrice
      ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.salePrice)
      : undefined,
    category: categories.find(cat => cat.id.toString() === product.categoryId)?.name || '',
    subcategory: Object.values(product.subcategoryValues || {}).join(', '),
    imageUrl: product.images.length > 0
      ? product.images[0].url
      : 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600&h=400',
    featured: product.featured,
    description: product.shortDescription || product.description,
  }));

  if (hideIfNone && !isLoading && formattedProducts.length === 0) {
    return null;
  }

  return (
    <section className={`py-12 md:py-20 ${className}`}>
      <div className="container mx-auto px-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando produtos em destaque...</p>
          </div>
        ) : formattedProducts.length > 0 ? (
          <>
            {/* Garante título único */}
            <div className="flex justify-between items-end mb-6">
              <h2 className="font-playfair text-3xl font-bold">{title}</h2>
            </div>
            <ProductSlider products={formattedProducts} hideTitle={true} />
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="font-playfair text-3xl font-bold mb-4">{title}</h2>
            <p className="text-muted-foreground">
              Nenhum produto em destaque encontrado. Marque produtos com a opção "Destaque na Página Inicial".
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
