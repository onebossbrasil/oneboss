import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Menu, X, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  return <header className="sticky top-0 z-50 w-full">
      <div className="glassmorphism px-4 py-3 md:px-8 md:py-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/lovable-uploads/cc202675-942c-4f4f-9e0c-0ba81e060e33.png" alt="ONE BOSS Luxury Marketplace" className="h-8 md:h-10 lg:h-12" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link to="/" className="font-medium hover:text-gold transition-colors text-sm lg:text-base">Home</Link>
            <Link to="/loja" className="font-medium hover:text-gold transition-colors text-sm lg:text-base">Categorias</Link>


          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-5 lg:space-x-6">
            {user ? (
              <>
                <Link to="/perfil" className="text-foreground hover:text-gold transition-colors" title="Perfil">
                  <User size={20} />
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-foreground hover:text-gold transition-colors text-sm lg:text-base font-medium"
                  title="Sair"
                >
                  <LogOut size={18} />
                  <span>Sair</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 text-foreground hover:text-gold transition-colors text-sm lg:text-base font-medium"
                title="Entrar"
              >
                <LogIn size={18} />
                <span>Entrar</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-3 md:hidden">
            <button className="text-foreground hover:text-gold transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && <div className="md:hidden glassmorphism absolute top-full left-0 w-full py-4 px-6 shadow-lg z-50">
          <nav className="flex flex-col space-y-3">
            <Link to="/" className="font-medium py-2 hover:text-gold transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/loja" className="font-medium py-2 hover:text-gold transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Categorias
            </Link>
            {user && (
              <Link to="/perfil" className="font-medium py-2 hover:text-gold transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Perfil
              </Link>
            )}
            <div className="border-t border-white/10 my-2"></div>
            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 font-medium py-2 hover:text-gold transition-colors text-left"
              >
                <LogOut size={18} />
                <span>Sair</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 font-medium py-2 hover:text-gold transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LogIn size={18} />
                <span>Entrar</span>
              </Link>
            )}
          </nav>
        </div>}
    </header>;
};
export default Header;