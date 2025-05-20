import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { List, Plus, Trash2, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCategories, CategoryType } from "@/contexts/CategoryContext";
import InlineEditInput from "./InlineEditInput";
import { updateSubcategory } from "@/services/category/subcategoryOperations";

type SubcategoryListProps = {
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  setSelectedSubcategory: (id: string | null) => void;
};

const SubcategoryList = ({
  selectedCategory,
  selectedSubcategory,
  setSelectedSubcategory
}: SubcategoryListProps) => {
  const { toast } = useToast();
  const { categories, addSubcategory, removeSubcategory } = useCategories();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [newSubcategoryType, setNewSubcategoryType] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const getCurrentCategory = (): CategoryType | null => {
    return categories.find(cat => cat.value === selectedCategory) || null;
  };

  const category = getCurrentCategory();

  const handleAddSubcategory = () => {
    if (!selectedCategory || !newSubcategoryName || !newSubcategoryType) return;
    const category = getCurrentCategory();
    if (!category) return;
    if (category.subcategories.some(sc => sc.type === newSubcategoryType)) {
      toast({
        title: "Erro ao adicionar subcategoria",
        description: "Já existe uma subcategoria com esse identificador nesta categoria.",
        variant: "destructive",
      });
      return;
    }
    addSubcategory(category.id, newSubcategoryName, newSubcategoryType);
    setNewSubcategoryName("");
    setNewSubcategoryType("");
    setDialogOpen(false);
    toast({
      title: "Subcategoria adicionada",
      description: `${newSubcategoryName} foi adicionada com sucesso.`,
    });
  };

  const handleRemoveSubcategory = (subcategoryId: string) => {
    if (!selectedCategory) return;
    const category = getCurrentCategory();
    if (!category) return;
    if (window.confirm("Tem certeza que deseja remover esta subcategoria?")) {
      removeSubcategory(category.id, subcategoryId);
      if (selectedSubcategory === subcategoryId) {
        setSelectedSubcategory(null);
      }
      toast({
        title: "Subcategoria removida",
        description: "A subcategoria foi removida com sucesso.",
      });
    }
  };

  const handleEditSubcategory = (subcat: any) => {
    setEditingId(subcat.id);
    setEditName(subcat.name);
    setEditType(subcat.type);
  };

  const handleSaveEdit = async (subcatId: string) => {
    setSavingEdit(true);
    try {
      await updateSubcategory(subcatId, editName, editType);
      setEditingId(null);
      await category && setTimeout(refreshCategory, 300); // triggers recarregar
      toast({
        title: "Subcategoria atualizada",
        description: "Subcategoria editada com sucesso."
      });
    } catch (error: any) {
      toast({
        title: "Erro ao editar subcategoria",
        description: error?.message || "Erro ao editar subcategoria",
        variant: "destructive",
      });
    } finally {
      setSavingEdit(false);
    }
  };

  // Forçar refresh da categoria atual ao editar
  function refreshCategory() {
    // Simples: só forçar um clique, ou use useCategories().refreshCategories(), se disponível
    window?.dispatchEvent(new CustomEvent('refreshCurrentCategory'));
  }

  return (
    <Card className="md:col-span-1 w-full md:w-[120%]">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">
              {category ? `Subcategorias: ${category.name}` : 'Subcategorias'}
            </h3>
            {category && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <Plus className="h-4 w-4 mr-1" /> <span className="md:inline hidden">Nova</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md max-w-[95vw] w-full">
                  <DialogHeader>
                    <DialogTitle>Adicionar Subcategoria</DialogTitle>
                    <DialogDescription>
                      Crie uma nova subcategoria para {category.name}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-subcategory">Nome da Subcategoria</Label>
                      <Input 
                        id="new-subcategory" 
                        placeholder="Ex: Tamanho" 
                        value={newSubcategoryName}
                        onChange={(e) => setNewSubcategoryName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-subcategory-type">Identificador (slug)</Label>
                      <Input 
                        id="new-subcategory-type" 
                        placeholder="Ex: tamanho" 
                        value={newSubcategoryType}
                        onChange={(e) => setNewSubcategoryType(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      onClick={handleAddSubcategory}
                      disabled={!newSubcategoryName || !newSubcategoryType}
                      className="w-full sm:w-auto"
                    >
                      Adicionar Subcategoria
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          {category ? (
            <div className="space-y-2">
              {category.subcategories.length > 0 ? (
                category.subcategories.map((subcat) => (
                  <div
                    key={subcat.id}
                    className={`flex items-center justify-between w-full p-2 rounded-md hover:bg-accent ${
                      selectedSubcategory === subcat.id ? 'bg-accent' : ''
                    }`}
                  >
                    {editingId === subcat.id ? (
                      <InlineEditInput
                        value={editName}
                        onChange={setEditName}
                        onSave={() => handleSaveEdit(subcat.id)}
                        onCancel={() => setEditingId(null)}
                        loading={savingEdit}
                        className="mr-2"
                      />
                    ) : (
                      <>
                        <button
                          className="flex items-center flex-1 text-left"
                          onClick={() => setSelectedSubcategory(subcat.id)}
                        >
                          <List className="h-4 w-4 mr-2" />
                          <span className="text-sm">{subcat.name}</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({subcat.attributes.length})
                          </span>
                        </button>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={e => {
                              e.stopPropagation();
                              handleEditSubcategory(subcat);
                            }}
                          >
                            <Edit className="h-4 w-4 text-primary" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSubcategory(subcat.id);
                            }}
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
                  Nenhuma subcategoria encontrada.
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-2">
              Selecione uma categoria para ver as subcategorias.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubcategoryList;
