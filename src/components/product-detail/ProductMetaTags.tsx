
import React from "react";
import { Helmet } from "react-helmet";
import { Product } from "@/types/product";

interface ProductMetaTagsProps {
  product: Product;
}

const ProductMetaTags = ({ product }: ProductMetaTagsProps) => {
  // Extract first product image or use fallback
  const productImage = product.images.length > 0 
    ? product.images[0].url 
    : "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=600&h=400";
  
  // Format price for display
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(product.salePrice || product.price);

  return (
    <Helmet>
      <title>{`${product.name} | ONE BOSS Luxury Marketplace`}</title>
      <meta 
        name="description" 
        content={product.shortDescription || product.description?.substring(0, 160) || `${product.name} - ONE BOSS Luxury Marketplace`} 
      />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="product" />
      <meta property="og:title" content={product.name} />
      <meta property="og:description" content={product.shortDescription || product.description?.substring(0, 160) || `${product.name} - ONE BOSS Luxury Marketplace`} />
      <meta property="og:image" content={productImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={product.name} />
      <meta name="twitter:description" content={product.shortDescription || product.description?.substring(0, 160) || `${product.name} - ONE BOSS Luxury Marketplace`} />
      <meta name="twitter:image" content={productImage} />
      
      {/* Product specific */}
      <meta property="product:price:amount" content={String(product.salePrice || product.price)} />
      <meta property="product:price:currency" content="BRL" />
      <meta property="product:availability" content={product.stockQuantity > 0 ? "in stock" : "out of stock"} />
    </Helmet>
  );
};

export default ProductMetaTags;
