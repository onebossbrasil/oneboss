import { ChevronLeft } from "lucide-react";
import { ProductProvider } from "@/contexts/ProductContext";
import ProductForm from "../ProductForm";
import CategoryManager from "../CategoryManager";
import CsvImporter from "../products/CsvImporter";
import ImportProductsCard from "../products/ImportProductsCard";
import ManageCategoriesCard from "../products/ManageCategoriesCard";
import ManageLeadsCard from "../products/ManageLeadsCard";
import { CategoryProvider } from "@/contexts/CategoryContext";

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
      
      <ProductProvider>
        {activeTab === "produtos" && <ProductForm />}
        {activeTab === "importar" && (
          <>
            <ImportProductsCard />
            <CsvImporter />
          </>
        )}
      </ProductProvider>
      
      {activeTab === "categorias" && (
        <CategoryProvider>
          <ManageCategoriesCard />
          <CategoryManager />
        </CategoryProvider>
      )}
      
      {activeTab === "leads" && (
        <>
          <ManageLeadsCard />
          <LeadsManager />
        </>
      )}
    </>
  );
};

export default MobileContent;
