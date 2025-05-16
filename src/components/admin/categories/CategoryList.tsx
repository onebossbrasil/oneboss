
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCategories } from "@/contexts/CategoryContext";
import CategoryListHeader from "./CategoryListHeader";
import CategoryListItem from "./CategoryListItem";

interface CategoryListProps {
  selectedCategory: string | null;
  setSelectedCategory: (value: string | null) => void;
  setSelectedSubcategory: (value: number | null) => void;
}

const CategoryList = ({
  selectedCategory,
  setSelectedCategory,
  setSelectedSubcategory
}: CategoryListProps) => {
  const { toast } = useToast();
  const { categories, addCategory, removeCategory, refreshCategories } = useCategories();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategorySlug, setNewCategorySlug] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);

  const handleAddCategory = async () => {
    if (!newCategoryName || !newCategorySlug) return;

    if (categories.some(cat => cat.value === newCategorySlug)) {
      toast({
        title: "Erro ao adicionar categoria",
        description: "Já existe uma categoria com esse identificador.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      await addCategory(newCategoryName, newCategorySlug);
      setNewCategoryName("");
      setNewCategorySlug("");
      setDialogOpen(false);
      await refreshCategories(); // atualização imediata
    } catch (error: any) {
      setFormError(error?.message || "Erro ao adicionar categoria. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveCategory = async (categoryId: string) => {
    if (window.confirm("Tem certeza que deseja remover esta categoria? Todos os produtos associados a ela ficarão sem categoria.")) {
      const categoryToRemove = categories.find(cat => String(cat.id) === categoryId);
      if (categoryToRemove && categoryToRemove.value === selectedCategory) {
        setSelectedCategory(null);
        setSelectedSubcategory(null);
      }
      try {
        setDeletingCategory(categoryId);
        await removeCategory(categoryId);
        await refreshCategories(); // atualização imediata
        toast({
          title: "Categoria removida",
          description: "A categoria foi removida com sucesso.",
        });
      } catch (error: any) {
        toast({
          title: "Erro ao remover categoria",
          description: error?.message || "Ocorreu um erro ao tentar remover a categoria. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setDeletingCategory(null);
      }
    }
  };

  // Refatoração: cards maiores, sem limites sufocantes, gap consistente, sem excesso de margem lateral
  return (
    <Card
      className="
        md:col-span-1 w-full
        max-w-none min-w-[340px]
        shadow-lg border
        px-0 bg-white
        md:mr-1 md:ml-0
      "
      style={{
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
      }}
    >
      <CardContent className="pt-6 pb-2 px-0">
        <div className="space-y-4">
          <CategoryListHeader
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            newCategoryName={newCategoryName}
            setNewCategoryName={setNewCategoryName}
            newCategorySlug={newCategorySlug}
            setNewCategorySlug={setNewCategorySlug}
            onAdd={handleAddCategory}
            isSubmitting={isSubmitting}
            formError={formError}
          />
          <div className="flex flex-col gap-4">
            {categories.map((cat) => (
              <CategoryListItem
                key={String(cat.id)}
                cat={{
                  id: String(cat.id),
                  name: cat.name,
                  value: cat.value,
                  subcategories: { length: cat.subcategories.length ?? 0 },
                }}
                selected={selectedCategory === cat.value}
                onSelect={() => {
                  setSelectedCategory(cat.value);
                  setSelectedSubcategory(null);
                }}
                onRemove={handleRemoveCategory}
                deleting={deletingCategory === String(cat.id)}
              />
            ))}
            {categories.length === 0 && (
              <p className="text-sm text-muted-foreground py-2">
                Nenhuma categoria encontrada. Adicione uma nova categoria para começar.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryList;
