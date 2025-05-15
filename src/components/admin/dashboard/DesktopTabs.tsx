import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductProvider } from "@/contexts/ProductContext";
import ProductForm from "../ProductForm";
import CategoryManager from "../CategoryManager";
import CsvImporter from "../products/CsvImporter";
import LeadsManager from "../LeadsManager";
import ImportProductsCard from "../products/ImportProductsCard";
import ManageCategoriesCard from "../products/ManageCategoriesCard";
import ManageLeadsCard from "../products/ManageLeadsCard";
import { Plus } from "lucide-react";

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
          {/* Product card já incluso dentro do ProductList */}
          <ProductForm />
        </TabsContent>
        
        <TabsContent value="importar" className="space-y-4">
          <ImportProductsCard />
          {/* CSV import step já aparece abaixo se necessário */}
          <CsvImporter />
        </TabsContent>
        
        <TabsContent value="categorias" className="space-y-4">
          <ManageCategoriesCard />
          <CategoryManager />
        </TabsContent>
      </ProductProvider>
      
      <TabsContent value="leads" className="space-y-4">
        <ManageLeadsCard />
        <LeadsManager />
      </TabsContent>
    </Tabs>
  );
};

export default DesktopTabs;
