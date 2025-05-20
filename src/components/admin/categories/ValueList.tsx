
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useCategories, CategoryType, SubcategoryType } from "@/contexts/CategoryContext";
import InlineEditInput from "./InlineEditInput";
import { updateSubcategoryValue } from "@/services/category/valueOperations";
import { AttributeType } from "@/types/category"; // <-- Import type

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
  const [adding, setAdding] = useState(false);
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

  // Check for duplicate attribute name
  const attributeNameExists = (name: string) => {
    return subcategory?.attributes.some(attr => attr.name === name);
  };

  const handleAddAttribute = async () => {
    if (!selectedCategory || !selectedSubcategory || !newAttributeName) return;
    if (!category || !subcategory) return;
    if (attributeNameExists(newAttributeName)) {
      toast({
        title: "Atributo duplicado",
        description: "Este atributo já existe nesta subcategoria.",
        variant: "destructive",
      });
      return;
    }
    try {
      await addSubcategoryValue(category.id, subcategory.id, newAttributeName);
      toast({
        title: "Atributo adicionado",
        description: `${newAttributeName} foi adicionado com sucesso.`,
      });
      setNewAttributeName("");
      setAdding(false);
    } catch (e: any) {
      toast({
        title: "Erro ao adicionar atributo",
        description: e?.message || String(e),
        variant: "destructive",
      });
    }
  };

  const handleRemoveAttribute = async (attr: AttributeType) => {
    if (!selectedCategory || !selectedSubcategory) return;
    if (!category || !subcategory) return;
    try {
      await removeSubcategoryValue(category.id, subcategory.id, attr.id);
      toast({
        title: "Atributo removido",
        description: `${attr.name} foi removido com sucesso.`,
      });
    } catch (e: any) {
      toast({
        title: "Erro ao remover atributo",
        description: e?.message || String(e),
        variant: "destructive",
      });
    }
  };

  const handleEditAttribute = async (oldAttr: AttributeType) => {
    if (!selectedCategory || !selectedSubcategory) return;
    if (!category || !subcategory) return;
    setSavingEdit(true);
    try {
      await updateSubcategoryValue(subcategory.id, oldAttr.id, editValue);
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
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAdding(!adding)}
                  className="h-9"
                >
                  <Plus className="h-4 w-4 mr-1" /> Novo
                </Button>
              </>
            )}
          </div>
          {adding && subcategory && (
            <div className="flex gap-2 items-center mb-1">
              <Input
                placeholder="Novo atributo..."
                value={newAttributeName}
                onChange={(e) => setNewAttributeName(e.target.value)}
                className="h-9 w-full md:w-40"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAddAttribute}
                disabled={!newAttributeName}
                className="h-9"
              >
                <span className="text-green-600 font-bold">✔</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setAdding(false);
                  setNewAttributeName("");
                }}
                className="h-9"
              >
                <span className="text-muted-foreground font-bold">✗</span>
              </Button>
            </div>
          )}
          {subcategory ? (
            <div className="space-y-2">
              {subcategory.attributes.length > 0 ? (
                subcategory.attributes.map((attr, index) => (
                  <div
                    key={attr.id}
                    className="flex items-center justify-between w-full p-2 rounded-md hover:bg-accent"
                  >
                    {editIndex === index ? (
                      <InlineEditInput
                        value={editValue}
                        onChange={setEditValue}
                        onSave={() => handleEditAttribute(attr)}
                        onCancel={() => setEditIndex(null)}
                        loading={savingEdit}
                        className="mr-2"
                      />
                    ) : (
                      <>
                        <span className="text-sm">{attr.name}</span>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditIndex(index);
                              setEditValue(attr.name);
                            }}
                          >
                            <Pencil className="h-4 w-4 text-primary" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveAttribute(attr)}
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
