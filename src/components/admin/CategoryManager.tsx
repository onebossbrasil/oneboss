
import { useState } from "react";
import { useCategories } from "@/contexts/CategoryContext";
import CategoryList from "./categories/CategoryList";
import SubcategoryList from "./categories/SubcategoryList";
import ValueList from "./categories/ValueList";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const CategoryManager = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null);
  const { isLoading, error, refreshCategories } = useCategories();

  const handleRefresh = () => {
    refreshCategories();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Carregando categorias...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro ao carregar categorias</AlertTitle>
        <AlertDescription>
          {error}. Por favor, tente novamente mais tarde.
        </AlertDescription>
        <Button variant="outline" className="mt-2" onClick={handleRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Tentar novamente
        </Button>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={handleRefresh} className="mb-2">
          <RefreshCw className="mr-2 h-4 w-4" />
          Atualizar categorias
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Categories Panel */}
        <CategoryList 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setSelectedSubcategory={setSelectedSubcategory}
        />
        
        {/* Subcategories Panel */}
        <SubcategoryList 
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          setSelectedSubcategory={setSelectedSubcategory}
        />
        
        {/* Values Panel */}
        <ValueList 
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
        />
      </div>
    </div>
  );
};

export default CategoryManager;
