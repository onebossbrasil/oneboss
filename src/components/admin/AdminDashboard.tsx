
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import ProductForm from "./ProductForm";
import CategoryManager from "./CategoryManager";
import CsvImporter from "./products/CsvImporter";
import { LogOut } from "lucide-react";

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("produtos");

  const handleLogout = () => {
    onLogout();
    toast({
      title: "Logout realizado",
      description: "Você saiu do painel administrativo.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="container mx-auto">
        <header className="flex justify-between items-center mb-6 pb-4 border-b">
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

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="space-y-6"
        >
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="produtos">Gerenciar Produtos</TabsTrigger>
            <TabsTrigger value="importar">Importar Produtos</TabsTrigger>
            <TabsTrigger value="categorias">Gerenciar Categorias</TabsTrigger>
          </TabsList>
          
          <TabsContent value="produtos" className="space-y-4">
            <ProductForm />
          </TabsContent>
          
          <TabsContent value="importar" className="space-y-4">
            <CsvImporter />
          </TabsContent>
          
          <TabsContent value="categorias" className="space-y-4">
            <CategoryManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
