
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newCategoryName: string;
  setNewCategoryName: (s: string) => void;
  newCategorySlug: string;
  setNewCategorySlug: (s: string) => void;
  onAdd: () => void;
  isSubmitting: boolean;
  formError: string | null;
};

const CategoryListHeader = ({
  open,
  onOpenChange,
  newCategoryName,
  setNewCategoryName,
  newCategorySlug,
  setNewCategorySlug,
  onAdd,
  isSubmitting,
  formError,
}: Props) => (
  <div className="flex justify-between items-center">
    <h3 className="text-lg font-medium">Categorias</h3>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-9">
          <Plus className="h-4 w-4 mr-1" /> <span className="md:inline hidden">Nova</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-w-[95vw] w-full">
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
            onClick={onAdd}
            disabled={!newCategoryName || !newCategorySlug || isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? "Adicionando..." : "Adicionar Categoria"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
);

export default CategoryListHeader;
