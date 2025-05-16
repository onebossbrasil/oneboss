import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Pencil, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useCategories, CategoryType, SubcategoryType } from "@/contexts/CategoryContext";
import InlineEditInput from "./InlineEditInput";
import { updateSubcategoryValue } from "@/services/category/valueOperations";

type AttributeListProps = {
  selectedCategory: string | null;
  selectedSubcategory: string | null;
};

const AttributeList = ({
  selectedCategory,
  selectedSubcategory
}: AttributeListProps) => {
  const { toast } = useToast();
  const { categories, addSubcategoryValue, removeSubcategoryValue } = useCategories();
  const [newAttributeName, setNewAttributeName] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const getCurrentCategory = (): CategoryType | null => {
    return categories.find(cat => cat.value === selectedCategory) || null;
  };

  const getCurrentSubcategory = (): SubcategoryType | null => {
    const category = getCurrentCategory();
    if (!category || !selectedSubcategory) return null;
    return category.subcategories.find(subcat => subcat.id === selectedSubcategory) || null;
  };

  const category = getCurrentCategory();
  const subcategory = getCurrentSubcategory();

  const handleAddAttribute = () => {
    if (!selectedCategory || !selectedSubcategory || !newAttributeName) return;
    const category = getCurrentCategory();
    const subcategory = getCurrentSubcategory();
    if (!category || !subcategory) return;
    if (subcategory.values.includes(newAttributeName)) {
      toast({
        title: "Atributo duplicado",
        description: "Este atributo já existe nesta subcategoria.",
        variant: "destructive",
      });
      return;
    }
    addSubcategoryValue(category.id, subcategory.id, newAttributeName);
    setNewAttributeName("");
    toast({
      title: "Atributo adicionado",
      description: `${newAttributeName} foi adicionado com sucesso.`,
    });
  };

  const handleRemoveAttribute = (value: string) => {
    if (!selectedCategory || !selectedSubcategory) return;
    const category = getCurrentCategory();
    const subcategory = getCurrentSubcategory();
    if (!category || !subcategory) return;
    removeSubcategoryValue(category.id, subcategory.id, value);
    toast({
      title: "Atributo removido",
      description: `${value} foi removido com sucesso.`,
    });
  };

  const handleEditAttribute = async (oldValue: string) => {
    if (!selectedCategory || !selectedSubcategory) return;
    const category = getCurrentCategory();
    const subcategory = getCurrentSubcategory();
    if (!category || !subcategory) return;

    setSavingEdit(true);
    try {
      await updateSubcategoryValue(subcategory.id, oldValue, editValue);
      await new Promise((r) => setTimeout(r, 150));
      toast({
        title: "Atributo atualizado",
        description: `${editValue} editado com sucesso.`,
      });
      setEditIndex(null);
    } catch (e: any) {
      toast({
        title: "Erro ao editar atributo",
        description: e?.message || String(e),
        variant: "destructive"
      });
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <Card className="md:col-span-1 w-full md:w-[120%]">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h3 className="text-lg font-medium">
              {subcategory ? `Atributos: ${subcategory.name}` : 'Atributos'}
            </h3>
            {subcategory && (
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="Novo atributo..."
                  value={newAttributeName}
                  onChange={(e) => setNewAttributeName(e.target.value)}
                  className="h-9 w-full md:w-40"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddAttribute}
                  disabled={!newAttributeName}
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
                    {editIndex === index ? (
                      <InlineEditInput
                        value={editValue}
                        onChange={setEditValue}
                        onSave={() => handleEditAttribute(value)}
                        onCancel={() => setEditIndex(null)}
                        loading={savingEdit}
                        className="mr-2"
                      />
                    ) : (
                      <>
                        <span className="text-sm">{value}</span>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditIndex(index);
                              setEditValue(value);
                            }}
                          >
                            <Pencil className="h-4 w-4 text-primary" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveAttribute(value)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-2">
                  Nenhum atributo encontrado. Adicione novos atributos para esta subcategoria.
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-2">
              Selecione uma subcategoria para gerenciar seus atributos.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AttributeList;
