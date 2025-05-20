
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "@/contexts/product";
import { useCategories } from "@/contexts/CategoryContext";
import { Product } from "@/types/product";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductDetailSkeleton from "@/components/product-detail/ProductDetailSkeleton";
import ProductNotFound from "@/components/product-detail/ProductNotFound";
import ProductMetaTags from "@/components/product-detail/ProductMetaTags";
import ProductDetailContent from "@/components/product-detail/ProductDetailContent";
import FeaturedProductsSection from "@/components/FeaturedProductsSection";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { products, isLoading, error } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);

  // Find and set the product from context
  useEffect(() => {
    if (productId && products.length > 0) {
      const foundProduct = products.find(p => p.id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
      }
    }
  }, [productId, products]);

  // Update page title when product changes
  useEffect(() => {
    if (product) {
      document.title = `ONE BOSS - ${product.name}`;
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
    return <ProductNotFound error={error} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {product && <ProductMetaTags product={product} />}
      <Header />
      {product && <ProductDetailContent product={product} onGoBack={handleGoBack} />}
      {/* NOVA SESSÃO: Produtos em destaque (exibir, exceto se for o próprio produto sendo exibido) */}
      <FeaturedProductsSection
        title="Veja também: Produtos em Destaque"
        className="bg-zinc-50 dark:bg-zinc-900/50"
        hideIfNone={true}
      />
      <Footer />
    </div>
  );
};

export default ProductDetail;
