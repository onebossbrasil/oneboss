
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { MessageCircle, Share2, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface MobileActionBarProps {
  product: Product;
}

const MobileActionBar = ({ product }: MobileActionBarProps) => {
  const { toast } = useToast();
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
          url: window.location.href,
        });
      } catch {
        /* Ignora cancelamentos */
      }
    } else {
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

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 shadow-t-lg flex justify-around items-center py-3 px-3 border-t glass-morphism animate-fade-in md:hidden">
      <Button size="lg" onClick={openWhatsApp} className="flex-1 mr-2 font-bold bg-primary text-white rounded-xl shadow hover:scale-105 transition-transform">
        <MessageCircle className="mr-2 h-5 w-5" />
        Falar com Vendedor
      </Button>
      <Button variant="outline" size="icon" className="h-12 w-12 mx-1" onClick={toggleFavorite}>
        <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
      </Button>
      <Button variant="outline" size="icon" className="h-12 w-12 ml-1" onClick={handleShare}>
        <Share2 className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default MobileActionBar;

