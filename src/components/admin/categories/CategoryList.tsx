
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Folder, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCategories } from "@/contexts/CategoryContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const { categories, addCategory, removeCategory } = useCategories();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategorySlug, setNewCategorySlug] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  const handleAddCategory = async () => {
    if (!newCategoryName || !newCategorySlug) return;
    
    // Verifica se já existe uma categoria com esse slug
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
      
      toast({
        title: "Categoria adicionada",
        description: `${newCategoryName} foi adicionada com sucesso.`,
      });
    } catch (error: any) {
      console.error("Error adding category:", error);
      setFormError(error?.message || "Erro ao adicionar categoria. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveCategory = (categoryId: number) => {
    if (window.confirm("Tem certeza que deseja remover esta categoria? Todos os produtos associados a ela ficarão sem categoria.")) {
      // Se a categoria que estamos removendo é a selecionada atualmente, limpa a seleção
      const categoryToRemove = categories.find(cat => cat.id === categoryId);
      if (categoryToRemove && categoryToRemove.value === selectedCategory) {
        setSelectedCategory(null);
        setSelectedSubcategory(null);
      }
      
      removeCategory(categoryId);
    }
  };
  
  return (
    <Card className="md:col-span-1">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Categorias</h3>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" /> Nova
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Categoria</DialogTitle>
                  <DialogDescription>
                    Crie uma nova categoria para seus produtos.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {formError && (
                    <Alert variant="destructive">
                      <AlertDescription>{formError}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="new-category">Nome da Categoria</Label>
                    <Input 
                      id="new-category" 
                      placeholder="Ex: Jóias" 
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-category-slug">Identificador (slug)</Label>
                    <Input 
                      id="new-category-slug" 
                      placeholder="Ex: joias" 
                      value={newCategorySlug}
                      onChange={(e) => setNewCategorySlug(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="button" 
                    onClick={handleAddCategory}
                    disabled={!newCategoryName || !newCategorySlug || isSubmitting}
                  >
                    {isSubmitting ? "Adicionando..." : "Adicionar Categoria"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="space-y-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between w-full"
              >
                <button
                  className={`flex items-center flex-1 p-2 rounded-md hover:bg-accent ${
                    selectedCategory === cat.value ? 'bg-accent' : ''
                  }`}
                  onClick={() => {
                    setSelectedCategory(cat.value);
                    setSelectedSubcategory(null);
                  }}
                >
                  <Folder className="h-4 w-4 mr-2" />
                  <span className="text-sm">{cat.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {cat.subcategories.length} subcategorias
                  </span>
                </button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveCategory(cat.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryList;
