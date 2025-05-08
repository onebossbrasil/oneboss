
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold/10 text-gold">
            <span className="font-playfair text-4xl font-bold">404</span>
          </div>
          
          <h1 className="font-playfair text-3xl font-bold mb-4">Página não encontrada</h1>
          
          <p className="text-muted-foreground mb-8">
            A página que você está procurando não existe ou foi removida.
            Talvez você queira retornar à página inicial.
          </p>
          
          <Button asChild className="bg-gold hover:bg-gold-light text-white">
            <Link to="/">
              Voltar para Home
            </Link>
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
