
import { ChevronLeft } from "lucide-react";
import { ProductProvider } from "@/contexts/ProductContext";
import ProductForm from "../ProductForm";
import CategoryManager from "../CategoryManager";
import CsvImporter from "../products/CsvImporter";
import LeadsManager from "../LeadsManager";

interface MobileContentProps {
  activeTab: string;
}

const MobileContent = ({ activeTab }: MobileContentProps) => {
  return (
    <>
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
      
      {/* Wrap product-related content with a single ProductProvider to prevent remounts */}
      <ProductProvider>
        {activeTab === "produtos" && <ProductForm />}
        {activeTab === "importar" && <CsvImporter />}
        {activeTab === "categorias" && <CategoryManager />}
      </ProductProvider>
      
      {activeTab === "leads" && <LeadsManager />}
    </>
  );
};

export default MobileContent;
