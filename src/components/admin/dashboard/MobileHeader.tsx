
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MobileHeaderProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  activeTab: string;
  handleTabChange: (tab: string) => void;
  handleLogout: () => void;
}

const MobileHeader = ({
  mobileMenuOpen,
  setMobileMenuOpen,
  activeTab,
  handleTabChange,
  handleLogout
}: MobileHeaderProps) => {
  return (
    <header className="lg:hidden flex justify-between items-center p-4 bg-white dark:bg-gray-800 border-b sticky top-0 z-30">
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[80%] p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="font-playfair text-xl">
              Painel Administrativo <span className="text-gold">Premium</span>
            </SheetTitle>
          </SheetHeader>
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Button
                  variant={activeTab === "produtos" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleTabChange("produtos")}
                >
                  Gerenciar Produtos
                </Button>
              </li>
              <li>
                <Button
                  variant={activeTab === "importar" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleTabChange("importar")}
                >
                  Importar Produtos
                </Button>
              </li>
              <li>
                <Button
                  variant={activeTab === "categorias" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleTabChange("categorias")}
                >
                  Gerenciar Categorias
                </Button>
              </li>
              <li>
                <Button
                  variant={activeTab === "leads" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleTabChange("leads")}
                >
                  Gerenciar Leads
                </Button>
              </li>
            </ul>
            <div className="mt-8 pt-4 border-t">
              <Button 
                variant="outline"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
      <h1 className="font-playfair text-lg font-bold">
        <span>Painel Premium</span>
      </h1>
      <Button variant="outline" size="icon" onClick={handleLogout}>
        <LogOut className="h-4 w-4" />
      </Button>
    </header>
  );
};

export default MobileHeader;
