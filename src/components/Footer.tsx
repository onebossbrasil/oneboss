
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Footer = () => {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    
    // Validate email
    if (!email || !email.includes('@')) {
      toast.error("Por favor, informe um email válido.");
      return;
    }
    
    toast.success("Obrigado por se inscrever em nossa newsletter!");
    form.reset();
  };

  return (
    <footer className="bg-secondary text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo and About */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <div className="text-gold font-playfair font-bold text-2xl md:text-3xl">
                <span className="tracking-wider">ONE</span>
                <span className="text-gold mx-1">✦</span>
                <span className="tracking-wider">BOSS</span>
              </div>
            </Link>
            <p className="text-white/70 mb-4">
              Seu marketplace de itens exclusivos e ultra premium para quem busca o extraordinário.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/60 hover:text-gold transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white/60 hover:text-gold transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white/60 hover:text-gold transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white/60 hover:text-gold transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-playfair font-semibold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/70 hover:text-gold transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/categories" className="text-white/70 hover:text-gold transition-colors">Categorias</Link>
              </li>
              <li>
                <Link to="/about" className="text-white/70 hover:text-gold transition-colors">Sobre Nós</Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/70 hover:text-gold transition-colors">Contato</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-playfair font-semibold text-lg mb-4">Categorias</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/categories/automoveis" className="text-white/70 hover:text-gold transition-colors">Automóveis</Link>
              </li>
              <li>
                <Link to="/categories/imoveis" className="text-white/70 hover:text-gold transition-colors">Imóveis</Link>
              </li>
              <li>
                <Link to="/categories/embarcacoes" className="text-white/70 hover:text-gold transition-colors">Embarcações</Link>
              </li>
              <li>
                <Link to="/categories/relogios" className="text-white/70 hover:text-gold transition-colors">Relógios</Link>
              </li>
              <li>
                <Link to="/categories/decoracao" className="text-white/70 hover:text-gold transition-colors">Decoração</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-playfair font-semibold text-lg mb-4">Newsletter</h3>
            <p className="text-white/70 mb-4">
              Receba lançamentos exclusivos e novidades em primeira mão.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <Input 
                type="email" 
                name="email"
                placeholder="Seu email" 
                className="bg-secondary-foreground/10 border-secondary-foreground/20 text-white placeholder:text-white/40"
                required
              />
              <Button 
                type="submit" 
                className="w-full bg-gold hover:bg-gold-light text-white"
              >
                Inscrever-se
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">
            &copy; {new Date().getFullYear()} ONE✦BOSS Luxury Marketplace. Todos os direitos reservados.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-4 text-sm text-white/60">
            <Link to="/terms" className="hover:text-gold transition-colors">Termos de Uso</Link>
            <Link to="/privacy" className="hover:text-gold transition-colors">Política de Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
