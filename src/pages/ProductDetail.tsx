import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFetchProductBySlug } from "@/hooks/use-fetch-product-by-slug";
import { Product } from "@/types/product";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductDetailSkeleton from "@/components/product-detail/ProductDetailSkeleton";
import ProductNotFound from "@/components/product-detail/ProductNotFound";
import ProductMetaTags from "@/components/product-detail/ProductMetaTags";
import ProductDetailContent from "@/components/product-detail/ProductDetailContent";
import FeaturedProductsSection from "@/components/FeaturedProductsSection";
import { FeaturedProductProvider } from "@/contexts/product/FeaturedProductProvider";

const ProductDetail = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const navigate = useNavigate();
  
  // Buscar produto por slug amigável
  const { product, isLoading, error } = useFetchProductBySlug(productSlug || null);

  // Update page title when product changes
  useEffect(() => {
    if (product) {
      document.title = `ONE BOSS - ${product.name}`;
      console.log(`[ProductDetail] Produto carregado diretamente do banco: ${product.name}, ${product.images.length} imagens:`, product.images);
    }
  }, [product]);

  // Handle navigation back to store
  const handleGoBack = () => {
    navigate("/loja");
  };

  // Show loading state
  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  // Show error state if product not found
  if (!product && !isLoading) {
    return <ProductNotFound error={error || "Produto não encontrado"} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {product && <ProductMetaTags product={product} />}
      <Header />
      {product && <ProductDetailContent product={product} onGoBack={handleGoBack} />}
      {/* NOVA SESSÃO: Produtos em destaque (exibir, exceto se for o próprio produto sendo exibido) */}
      <FeaturedProductProvider>
        <FeaturedProductsSection
          title="Veja também: Produtos em Destaque"
          className="bg-zinc-50 dark:bg-zinc-900/50"
          hideIfNone={true}
        />
      </FeaturedProductProvider>
      <Footer />
    </div>
  );
};

export default ProductDetail;
