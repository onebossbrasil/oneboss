
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { MessageCircle, Share2, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface MobileActionBarProps {
  product: Product;
}

const whatsappColor = "#25D366"; // Cor oficial do WhatsApp

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
    const message = `Olá, vim do site e quero saber mais sobre o produto "${product.name}"`;
    const whatsappUrl = `https://wa.me/5562982801810?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 shadow-t-lg flex items-center py-2 px-2 border-t glass-morphism animate-fade-in md:hidden">
      <Button
        size="lg"
        onClick={openWhatsApp}
        style={{
          backgroundColor: whatsappColor,
          color: "white",
          boxShadow: "0 4px 16px 0 rgba(37,211,102,0.12)",
        }}
        className="w-full font-bold text-base rounded-full h-11 flex justify-center items-center shadow-md transition-transform duration-150 active:scale-98 focus:outline-none focus:ring-2 focus:ring-green-400 px-0"
      >
        <MessageCircle className="mr-2 h-5 w-5" />
        Falar com Vendedor
      </Button>
      <div className="flex flex-col ml-2 gap-2">
        <Button variant="outline" size="icon" className="h-11 w-11" onClick={toggleFavorite}>
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
        <Button variant="outline" size="icon" className="h-11 w-11" onClick={handleShare}>
          <Share2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default MobileActionBar;
