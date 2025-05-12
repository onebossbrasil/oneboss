
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductProvider } from "@/contexts/ProductContext";
import ProductForm from "../ProductForm";
import CategoryManager from "../CategoryManager";
import CsvImporter from "../products/CsvImporter";
import LeadsManager from "../LeadsManager";

interface DesktopTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const DesktopTabs = ({ activeTab, onTabChange }: DesktopTabsProps) => {
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={onTabChange} 
      className="space-y-6"
    >
      <TabsList className="grid grid-cols-4 w-full max-w-2xl">
        <TabsTrigger value="produtos">Gerenciar Produtos</TabsTrigger>
        <TabsTrigger value="importar">Importar Produtos</TabsTrigger>
        <TabsTrigger value="categorias">Gerenciar Categorias</TabsTrigger>
        <TabsTrigger value="leads">Gerenciar Leads</TabsTrigger>
      </TabsList>
      
      {/* Wrap products related tabs with a single ProductProvider to avoid remounting */}
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
  );
};

export default DesktopTabs;
