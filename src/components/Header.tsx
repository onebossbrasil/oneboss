
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Menu, X } from 'lucide-react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glassmorphism px-4 py-3 md:px-8 md:py-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/cc202675-942c-4f4f-9e0c-0ba81e060e33.png" 
              alt="ONE BOSS Luxury Marketplace" 
              className="h-8 md:h-10 lg:h-12"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link to="/" className="font-medium hover:text-gold transition-colors text-sm lg:text-base">Home</Link>
            <Link to="/loja" className="font-medium hover:text-gold transition-colors text-sm lg:text-base">Categorias</Link>
            <Link to="/about" className="font-medium hover:text-gold transition-colors text-sm lg:text-base">Sobre</Link>
            <Link to="/contact" className="font-medium hover:text-gold transition-colors text-sm lg:text-base">Contato</Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-5 lg:space-x-6">
            <button className="text-foreground hover:text-gold transition-colors">
              <Search size={20} />
            </button>
            <Link to="/profile" className="text-foreground hover:text-gold transition-colors">
              <User size={20} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-3 md:hidden">
            <button 
              className="text-foreground hover:text-gold transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glassmorphism absolute top-full left-0 w-full py-4 px-6 shadow-lg z-50">
          <nav className="flex flex-col space-y-3">
            <Link 
              to="/" 
              className="font-medium py-2 hover:text-gold transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/loja" 
              className="font-medium py-2 hover:text-gold transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Categorias
            </Link>
            <Link 
              to="/about" 
              className="font-medium py-2 hover:text-gold transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sobre
            </Link>
            <Link 
              to="/contact" 
              className="font-medium py-2 hover:text-gold transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contato
            </Link>
            <div className="flex items-center space-x-4 pt-2">
              <button className="text-foreground hover:text-gold transition-colors">
                <Search size={20} />
              </button>
              <Link to="/profile" className="text-foreground hover:text-gold transition-colors">
                <User size={20} />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
