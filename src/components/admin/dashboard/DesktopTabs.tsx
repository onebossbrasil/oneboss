import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductProvider } from "@/contexts/ProductContext";
import ProductList from "../ProductList";
import CategoryManager from "../CategoryManager";
import LeadsManager from "../LeadsManager";
import ManageCategoriesCard from "../products/ManageCategoriesCard";
import ManageLeadsCard from "../products/ManageLeadsCard";

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
      <TabsList className="grid grid-cols-3 w-full max-w-2xl">
        <TabsTrigger value="produtos">Gerenciar Produtos</TabsTrigger>
        <TabsTrigger value="categorias">Gerenciar Categorias</TabsTrigger>
        <TabsTrigger value="leads">Gerenciar Leads</TabsTrigger>
      </TabsList>
      {/* Wrap products related tabs with a single ProductProvider to avoid remounting */}
      <ProductProvider>
        <TabsContent value="produtos" className="space-y-4">
          {/* Trocar ProductForm por ProductList */}
          <ProductList />
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
