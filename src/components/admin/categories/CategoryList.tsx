import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCategories } from "@/contexts/CategoryContext";
import { Button } from "@/components/ui/button";
import { Folder, Trash2, Loader2, List } from "lucide-react";
import InlineEditInput from "./InlineEditInput";
import { Edit } from "lucide-react";
import { updateCategory } from "@/services/category/categoryOperations";

interface CategoryListProps {
  selectedCategory: string | null;
  setSelectedCategory: (value: string | null) => void;
  setSelectedSubcategory: (value: string | null) => void; // Usar string
}

const CategoryList = ({
  selectedCategory,
  setSelectedCategory,
  setSelectedSubcategory,
}: CategoryListProps) => {
  const { toast } = useToast();
  const { categories, removeCategory, refreshCategories } = useCategories();
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editValue, setEditValue] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const handleRemoveCategory = async (categoryId: string) => {
    if (
      window.confirm(
        "Tem certeza que deseja remover esta categoria? Todos os produtos associados a ela ficarão sem categoria."
      )
    ) {
      const categoryToRemove = categories.find((cat) => cat.id === categoryId);
      if (categoryToRemove && categoryToRemove.value === selectedCategory) {
        setSelectedCategory(null);
        setSelectedSubcategory(null);
      }
      try {
        setDeletingCategory(categoryId);
        await removeCategory(categoryId);
        await refreshCategories();
        toast({
          title: "Categoria removida",
          description: "A categoria foi removida com sucesso.",
        });
      } catch (error: any) {
        toast({
          title: "Erro ao remover categoria",
          description:
            error?.message ||
            "Ocorreu um erro ao tentar remover a categoria. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setDeletingCategory(null);
      }
    }
  };

  const handleEditCategory = (cat: typeof categories[0]) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditValue(cat.value);
  };

  const handleSaveEdit = async (catId: string) => {
    setSavingEdit(true);
    try {
      await updateCategory(catId, editName, editValue);
      await refreshCategories();
      toast({
        title: "Categoria atualizada",
        description: "Categoria editada com sucesso.",
      });
      setEditingId(null);
    } catch (error: any) {
      toast({
        title: "Erro ao editar categoria",
        description: error?.message || "Erro ao editar categoria",
        variant: "destructive",
      });
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <Card className="md:col-span-1 w-full md:w-[120%]">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium mb-0 pl-1">Categorias</h3>
          <div className="space-y-2">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`flex items-center justify-between w-full p-2 rounded-md border hover:bg-accent transition-colors 
                    ${selectedCategory === cat.value ? "bg-accent border-primary" : "bg-white border"}`}
                  style={{ minHeight: "52px", cursor: "pointer" }}
                  onClick={() => {
                    setSelectedCategory(cat.value);
                    setSelectedSubcategory(null);
                  }}
                  tabIndex={0}
                  aria-selected={selectedCategory === cat.value}
                >
                  {editingId === cat.id ? (
                    <InlineEditInput
                      value={editName}
                      onChange={setEditName}
                      onSave={() => handleSaveEdit(cat.id)}
                      onCancel={() => setEditingId(null)}
                      loading={savingEdit}
                      className="mr-2"
                    />
                  ) : (
                    <>
                      <span className="flex items-center flex-1 text-left">
                        <List className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-sm font-medium truncate max-w-[60%]" title={cat.name}>
                          {cat.name}
                        </span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({cat.subcategories.length ?? 0})
                        </span>
                      </span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={e => {
                            e.stopPropagation();
                            handleEditCategory(cat);
                          }}
                          className="text-primary hover:bg-accent"
                          aria-label="Editar categoria"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={e => {
                            e.stopPropagation();
                            handleRemoveCategory(cat.id);
                          }}
                          disabled={deletingCategory === cat.id}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-1"
                          aria-label="Excluir categoria"
                        >
                          {deletingCategory === cat.id ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Trash2 className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <div className="py-2 text-center text-muted-foreground text-sm">
                Nenhuma categoria encontrada. Adicione uma nova categoria para começar.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryList;
