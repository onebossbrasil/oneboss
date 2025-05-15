
import { ChevronLeft } from "lucide-react";
import { ProductProvider } from "@/contexts/ProductContext";
import ProductForm from "../ProductForm";
import CategoryManager from "../CategoryManager";
import { CategoryProvider } from "@/contexts/CategoryContext";
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
          {activeTab === "categorias" && "Gerenciar Categorias"}
          {activeTab === "leads" && "Gerenciar Leads"}
        </h2>
      </div>
      <ProductProvider>
        {activeTab === "produtos" && <ProductForm />}
      </ProductProvider>
      {activeTab === "categorias" && (
        <CategoryProvider>
          <CategoryManager />
        </CategoryProvider>
      )}
      {activeTab === "leads" && (
        <LeadsManager />
      )}
    </>
  );
};

export default MobileContent;
