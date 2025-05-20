
import { useState } from "react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, MessageCircle, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
interface ProductInfoProps {
  product: Product;
}
const whatsappColor = "#25D366"; // Cor oficial do WhatsApp
const ProductInfo = ({
  product
}: ProductInfoProps) => {
  const {
    toast
  } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
      description: isFavorite ? "O produto foi removido dos seus favoritos" : "O produto foi adicionado aos seus favoritos",
      variant: "default"
    });
  };
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.shortDescription,
          url: window.location.href
        });
      } catch (error) {
        console.log("Erro ao compartilhar:", error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copiado",
        description: "O link do produto foi copiado para sua área de transferência"
      });
    }
  };
  const openWhatsApp = () => {
    const message = `Olá, gostaria de mais informações sobre o produto: ${product.name} (${window.location.href})`;
    const whatsappUrl = `https://wa.me/5500000000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  // Format price in BRL
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(price);
  };
  return <div className="product-info space-y-6">
      {/* Product Name and Badges */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{product.name}</h1>
        <div className="flex flex-wrap gap-2 mt-3">
          {product.featured && <Badge variant="default" className="bg-amber-600 hover:bg-amber-700">Destaque</Badge>}
          {product.stockQuantity > 0 ? <Badge variant="outline" className="border-green-500 text-green-700">
              Em Estoque
            </Badge> : <Badge variant="outline" className="border-red-500 text-red-700">
              Sob encomenda
            </Badge>}
          {product.salePrice && product.salePrice < product.price && <Badge variant="default" className="bg-red-500 hover:bg-red-600">
              Promoção
            </Badge>}
        </div>
      </div>

      {/* Short Description */}
      {product.shortDescription && <p className="text-muted-foreground text-lg">
          {product.shortDescription}
        </p>}

      {/* Price Display */}
      <div className="mt-4">
        {product.salePrice ? <div className="space-y-1">
            <div className="text-muted-foreground line-through text-lg">
              {formatPrice(product.price)}
            </div>
            <div className="text-3xl font-bold text-red-600">
              {formatPrice(product.salePrice)}
            </div>
          </div> : <div className="text-3xl font-bold">
            {formatPrice(product.price)}
          </div>}
      </div>

      {/* Action Buttons - SÓ DESKTOP */}
      <div className="hidden md:flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          size="lg"
          onClick={openWhatsApp}
          style={{ backgroundColor: whatsappColor, color: "white" }}
          className="flex-1 font-bold rounded-xl border-none"
        >
          <MessageCircle className="mr-2 h-5 w-5" />
          Falar com Vendedor
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" size="icon" className="h-12 w-12" onClick={toggleFavorite}>
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            <span className="sr-only">Favoritar</span>
          </Button>
          <Button variant="outline" size="icon" className="h-12 w-12" onClick={handleShare}>
            <Share2 className="h-5 w-5" />
            <span className="sr-only">Compartilhar</span>
          </Button>
        </div>
      </div>

      {/* Product Details Card */}
      <Card className="p-4 mt-6 bg-gray-50/50">
        <h3 className="font-medium mb-2">Detalhes do Produto</h3>
        <dl className="space-y-2 text-sm">
          {product.categoryId && <div className="grid grid-cols-3">
              <dt className="font-medium text-muted-foreground">Categoria:</dt>
              <dd className="col-span-2">
                {Object.entries(product.subcategoryValues || {}).length > 0 ? Object.entries(product.subcategoryValues).map(([key, value]) => <div key={key} className="mb-1">
                        <span className="capitalize">{key.replace('_', ' ')}: </span> 
                        <span className="font-medium">{value}</span>
                      </div>) : "Não especificada"}
              </dd>
            </div>}
          {product.stockQuantity > 0 && <div className="grid grid-cols-3">
              <dt className="font-medium text-muted-foreground">Disponibilidade:</dt>
              <dd className="col-span-2">
                {product.stockQuantity} {product.stockQuantity === 1 ? "unidade" : "unidades"} em estoque
              </dd>
            </div>}
          <div className="grid grid-cols-3">
            <dt className="font-medium text-muted-foreground">Código:</dt>
            <dd className="col-span-2 font-mono">{product.id.substring(0, 8).toUpperCase()}</dd>
          </div>
        </dl>
      </Card>
    </div>;
};
export default ProductInfo;
