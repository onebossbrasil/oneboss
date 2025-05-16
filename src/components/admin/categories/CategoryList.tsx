import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCategories } from "@/contexts/CategoryContext";
import CategoryListItem from "./CategoryListItem";

interface CategoryListProps {
  selectedCategory: string | null;
  setSelectedCategory: (value: string | null) => void;
  setSelectedSubcategory: (value: number | null) => void;
}

const CategoryList = ({
  selectedCategory,
  setSelectedCategory,
  setSelectedSubcategory,
}: CategoryListProps) => {
  const { toast } = useToast();
  const { categories, addCategory, removeCategory, refreshCategories } = useCategories();
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);

  const handleRemoveCategory = async (categoryId: string) => {
    if (
      window.confirm(
        "Tem certeza que deseja remover esta categoria? Todos os produtos associados a ela ficarão sem categoria."
      )
    ) {
      const categoryToRemove = categories.find((cat) => String(cat.id) === categoryId);
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

  return (
    <Card className="md:col-span-1 w-full md:w-[120%]">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium mb-0 pl-1">Categorias</h3>

          <div className="space-y-2">
            {categories.length > 0 ? (
              categories.map((cat) => (
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
