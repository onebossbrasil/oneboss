
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import ProductForm from "./ProductForm";
import CategoryManager from "./CategoryManager";
import CsvImporter from "./products/CsvImporter";
import LeadsManager from "./LeadsManager";
import { ChevronLeft, LogOut, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { ProductProvider } from "@/contexts/ProductContext";

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("produtos");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    toast({
      title: "Logout realizado",
      description: "Você saiu do painel administrativo.",
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setMobileMenuOpen(false); // Close mobile menu when tab changes
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col w-full">
        {/* Mobile Header */}
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

        {/* Desktop Header */}
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

        <div className="flex-1 p-4">
          {/* Desktop Tabs */}
          <div className="hidden lg:block">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="space-y-6"
            >
              <TabsList className="grid grid-cols-4 w-full max-w-2xl">
                <TabsTrigger value="produtos">Gerenciar Produtos</TabsTrigger>
                <TabsTrigger value="importar">Importar Produtos</TabsTrigger>
                <TabsTrigger value="categorias">Gerenciar Categorias</TabsTrigger>
                <TabsTrigger value="leads">Gerenciar Leads</TabsTrigger>
              </TabsList>
              
              <ProductProvider>
                <TabsContent value="produtos" className="space-y-4">
                  <ProductForm />
                </TabsContent>
                
                <TabsContent value="importar" className="space-y-4">
                  <CsvImporter />
                </TabsContent>
                
                <TabsContent value="categorias" className="space-y-4">
                  <CategoryManager />
                </TabsContent>
              </ProductProvider>
              
              <TabsContent value="leads" className="space-y-4">
                <LeadsManager />
              </TabsContent>
            </Tabs>
          </div>

          {/* Mobile Content with Breadcrumb */}
          <div className="lg:hidden">
            <div className="mb-4">
              <div className="flex items-center mb-4">
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span className="text-sm text-muted-foreground">Selecione uma opção do menu</span>
              </div>
              <h2 className="text-xl font-bold mb-4">
                {activeTab === "produtos" && "Gerenciar Produtos"}
                {activeTab === "importar" && "Importar Produtos"}
                {activeTab === "categorias" && "Gerenciar Categorias"}
                {activeTab === "leads" && "Gerenciar Leads"}
              </h2>
            </div>
            
            <ProductProvider>
              {activeTab === "produtos" && <ProductForm />}
              {activeTab === "importar" && <CsvImporter />}
              {activeTab === "categorias" && <CategoryManager />}
            </ProductProvider>
            
            {activeTab === "leads" && <LeadsManager />}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
