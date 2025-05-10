
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useCategories, CategoryType, SubcategoryType } from "@/contexts/CategoryContext";

type ValueListProps = {
  selectedCategory: string | null;
  selectedSubcategory: number | null;
};

const ValueList = ({
  selectedCategory,
  selectedSubcategory
}: ValueListProps) => {
  const { toast } = useToast();
  const { categories, addSubcategoryValue, removeSubcategoryValue } = useCategories();
  const [newValueName, setNewValueName] = useState("");
  
  const getCurrentCategory = (): CategoryType | null => {
    return categories.find(cat => cat.value === selectedCategory) || null;
  };
  
  const getCurrentSubcategory = (): SubcategoryType | null => {
    const category = getCurrentCategory();
    if (!category || selectedSubcategory === null) return null;
    return category.subcategories.find(subcat => subcat.id === selectedSubcategory) || null;
  };
  
  const category = getCurrentCategory();
  const subcategory = getCurrentSubcategory();
  
  const handleAddValue = () => {
    if (!selectedCategory || selectedSubcategory === null || !newValueName) return;
    
    const category = getCurrentCategory();
    const subcategory = getCurrentSubcategory();
    
    if (!category || !subcategory) return;
    
    // Verifica se o valor já existe
    if (subcategory.values.includes(newValueName)) {
      toast({
        title: "Valor duplicado",
        description: "Este valor já existe nesta subcategoria.",
        variant: "destructive",
      });
      return;
    }
    
    addSubcategoryValue(category.id, subcategory.id, newValueName);
    setNewValueName("");
    
    toast({
      title: "Valor adicionado",
      description: `${newValueName} foi adicionado com sucesso.`,
    });
  };
  
  const handleRemoveValue = (value: string) => {
    if (!selectedCategory || selectedSubcategory === null) return;
    
    const category = getCurrentCategory();
    const subcategory = getCurrentSubcategory();
    
    if (!category || !subcategory) return;
    
    removeSubcategoryValue(category.id, subcategory.id, value);
    
    toast({
      title: "Valor removido",
      description: `${value} foi removido com sucesso.`,
    });
  };
  
  return (
    <Card className="md:col-span-1">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h3 className="text-lg font-medium">
              {subcategory ? `Valores: ${subcategory.name}` : 'Valores'}
            </h3>
            {subcategory && (
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="Novo valor..."
                  value={newValueName}
                  onChange={(e) => setNewValueName(e.target.value)}
                  className="h-9 w-full md:w-40"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddValue}
                  disabled={!newValueName}
                  className="h-9"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          
          {subcategory ? (
            <div className="space-y-2">
              {subcategory.values.length > 0 ? (
                subcategory.values.map((value, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between w-full p-2 rounded-md hover:bg-accent"
                  >
                    <span className="text-sm">{value}</span>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemoveValue(value)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-2">
                  Nenhum valor encontrado. Adicione novos valores para esta subcategoria.
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-2">
              Selecione uma subcategoria para gerenciar seus valores.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ValueList;
