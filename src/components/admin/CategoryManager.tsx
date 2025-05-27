import { useState, useEffect } from "react";
import { useCategories } from "@/contexts/CategoryContext";
import CategoryList from "./categories/CategoryList";
import SubcategoryList from "./categories/SubcategoryList";
import ValueList from "./categories/ValueList";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LOCAL_STORAGE_KEYS = {
  selectedCategory: "catman_selectedCategory_v1",
  selectedSubcategory: "catman_selectedSubcategory_v1",
  activeTab: "catman_activeTab_v1"
};

const CategoryManager = () => {
  // 1. Tenta restaurar estado salvo
  const [selectedCategory, setSelectedCategory] = useState<string | null>(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.selectedCategory) || null;
  });
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.selectedSubcategory) || null;
  });
  const [activeTab, setActiveTab] = useState<string>(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.activeTab) || "categories";
  });
  const { isLoading, error, refreshCategories } = useCategories();

  // 2. Seta persistência ao mudar cada estado relevante
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.selectedCategory, selectedCategory ?? "");
  }, [selectedCategory]);
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.selectedSubcategory, selectedSubcategory ?? "");
  }, [selectedSubcategory]);
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.activeTab, activeTab);
  }, [activeTab]);

  // Limpeza (opcional): Limpa subcategoria se categoria muda
  useEffect(() => {
    if (!selectedCategory) {
      setSelectedSubcategory(null);
    }
  }, [selectedCategory]);

  // Reset subcategory selection when changing to categories tab on mobile
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "categories") {
      setSelectedSubcategory(null);
    }
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
        <Button variant="outline" className="mt-2" onClick={refreshCategories}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Tentar novamente
        </Button>
      </Alert>
    );
  }

  // Show breadcrumb navigation for mobile (only when a category is selected)
  const renderMobileBreadcrumb = () => {
    if (!selectedCategory) return null;

    const category = useCategories().categories.find(cat => cat.value === selectedCategory);
    const subcategory = category?.subcategories.find(sub => sub.id === selectedSubcategory);

    return (
      <div className="flex flex-wrap items-center text-sm mb-4 text-muted-foreground">
        <button 
          onClick={() => {
            setActiveTab("categories");
            setSelectedSubcategory(null);
          }}
          className="hover:underline"
        >
          Categorias
        </button>

        {selectedCategory && (
          <>
            <span className="mx-2">/</span>
            <button 
              onClick={() => {
                setActiveTab("subcategories");
                setSelectedSubcategory(null);
              }}
              className="hover:underline"
            >
              {category?.name}
            </button>
          </>
        )}

        {selectedSubcategory && (
          <>
            <span className="mx-2">/</span>
            <button 
              onClick={() => setActiveTab("values")}
              className="hover:underline"
            >
              {subcategory?.name}
            </button>
          </>
        )}
      </div>
    );
  };

  // Desktop view (three panels side by side, increased gap)
  const desktopView = (
    <div className="hidden md:grid md:grid-cols-3 gap-12">
      <CategoryList 
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        setSelectedSubcategory={setSelectedSubcategory}
      />
      <SubcategoryList 
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        setSelectedSubcategory={setSelectedSubcategory}
      />
      <ValueList 
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
      />
    </div>
  );

  // Mobile view (tabs navigation)
  const mobileView = (
    <div className="md:hidden">
      {renderMobileBreadcrumb()}
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="subcategories" disabled={!selectedCategory}>Subcategorias</TabsTrigger>
          <TabsTrigger value="values" disabled={!selectedSubcategory}>Valores</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories">
          <CategoryList 
            selectedCategory={selectedCategory}
            setSelectedCategory={(cat) => {
              setSelectedCategory(cat);
              if (cat) {
                setActiveTab("subcategories");
              }
            }}
            setSelectedSubcategory={setSelectedSubcategory}
          />
        </TabsContent>
        
        <TabsContent value="subcategories">
          <SubcategoryList 
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            setSelectedSubcategory={(subcat) => {
              setSelectedSubcategory(subcat);
              if (subcat) {
                setActiveTab("values");
              }
            }}
          />
        </TabsContent>
        
        <TabsContent value="values">
          <ValueList 
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
          />
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end lg:hidden">
        <Button variant="outline" size="sm" onClick={refreshCategories} className="mb-2">
          <RefreshCw className="mr-2 h-4 w-4" />
          Atualizar categorias
        </Button>
      </div>
      
      {desktopView}
      {mobileView}
    </div>
  );
};

export default CategoryManager;
