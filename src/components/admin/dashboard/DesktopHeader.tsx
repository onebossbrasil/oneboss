
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface DesktopHeaderProps {
  handleLogout: () => void;
}

const DesktopHeader = ({ handleLogout }: DesktopHeaderProps) => {
  return (
    <header className="hidden lg:flex justify-between items-center mb-6 p-4 pb-2 border-b">
      <div>
        <h1 className="font-playfair text-3xl font-bold">
          Painel Administrativo <span className="text-gold">Premium</span>
        </h1>
        <p className="text-muted-foreground">
          Gerencie produtos e categorias da loja
        </p>
      </div>
      <Button variant="outline" onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        Sair
      </Button>
    </header>
  );
};

export default DesktopHeader;
