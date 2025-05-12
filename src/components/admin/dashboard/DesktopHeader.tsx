
import { Button } from "@/components/ui/button";
import { LogOut, RefreshCw } from "lucide-react";
import { useCategories } from "@/contexts/CategoryContext";

interface DesktopHeaderProps {
  handleLogout: () => void;
  activeTab?: string;
}

const DesktopHeader = ({ handleLogout, activeTab }: DesktopHeaderProps) => {
  const { refreshCategories } = useCategories();
  
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
      <div className="flex gap-2">
        {activeTab === "categorias" && (
          <Button variant="outline" onClick={refreshCategories} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Atualizar categorias
          </Button>
        )}
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </header>
  );
};

export default DesktopHeader;
