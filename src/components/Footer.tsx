import { Link } from "react-router-dom";
import { Phone, Mail, Instagram, Facebook, Twitter } from "lucide-react";
import NewsletterSignup from "./NewsletterSignup";
const Footer = () => {
  return <footer className="bg-zinc-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gold/80 py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-playfair text-2xl md:text-3xl font-semibold mb-4">Receba ofertas exclusivas</h3>
          <p className="text-zinc-800 mb-6 max-w-2xl mx-auto">Lançamentos antecipados e acesso a produtos limitados diretamente no seu email.</p>
          <div className="flex justify-center">
            <NewsletterSignup />
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <h4 className="font-playfair text-xl font-semibold text-gold mb-4">One Boss</h4>
            <p className="text-zinc-400 mb-6">
              O marketplace para quem busca exclusividade e excelência em produtos premium.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-zinc-400 hover:text-gold">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-zinc-400 hover:text-gold">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-zinc-400 hover:text-gold">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-playfair text-lg font-semibold text-gold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-zinc-400 hover:text-white">Home</Link></li>
              <li><Link to="/loja" className="text-zinc-400 hover:text-white">Produtos</Link></li>
              <li><Link to="/sobre" className="text-zinc-400 hover:text-white">Sobre Nós</Link></li>
              <li><Link to="/contato" className="text-zinc-400 hover:text-white">Contato</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-playfair text-lg font-semibold text-gold mb-4">Categorias</h4>
            <ul className="space-y-2">
              <li><Link to="/loja/imoveis" className="text-zinc-400 hover:text-white">Imóveis</Link></li>
              <li><Link to="/loja/veiculos" className="text-zinc-400 hover:text-white">Automóveis</Link></li>
              <li><Link to="/loja/embarcacoes" className="text-zinc-400 hover:text-white">Embarcações</Link></li>
              <li><Link to="/loja/relogios" className="text-zinc-400 hover:text-white">Relógios</Link></li>
              <li><Link to="/loja/decoracao" className="text-zinc-400 hover:text-white">Decoração</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-playfair text-lg font-semibold text-gold mb-4">Entre em Contato</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone size={18} className="text-gold mr-3" />
                <span className="text-zinc-400">+55 (11) 99999-9999</span>
              </div>
              <div className="flex items-center">
                <Mail size={18} className="text-gold mr-3" />
                <span className="text-zinc-400">contato@oneboss.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-zinc-800 mt-12 pt-6 text-center text-zinc-500 text-sm">
          <p>© 2025 One Boss. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;