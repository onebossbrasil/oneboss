
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Folder, List, Plus, Trash2 } from "lucide-react";
import { useCategories } from "@/contexts/CategoryContext";

const CategoryManager = () => {
  const { toast } = useToast();
  const { 
    categories, 
    addCategory, 
    removeCategory, 
    addSubcategory, 
    removeSubcategory, 
    addSubcategoryValue, 
    removeSubcategoryValue 
  } = useCategories();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategorySlug, setNewCategorySlug] = useState("");
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [newSubcategoryType, setNewSubcategoryType] = useState("");
  const [newValueName, setNewValueName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  
  const getCurrentCategory = () => {
    return categories.find(cat => cat.value === selectedCategory) || null;
  };
  
  const getCurrentSubcategory = () => {
    const category = getCurrentCategory();
    if (!category || selectedSubcategory === null) return null;
    return category.subcategories.find(subcat => subcat.id === selectedSubcategory) || null;
  };
  
  const handleAddCategory = () => {
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
    
    addCategory(newCategoryName, newCategorySlug);
    
    setNewCategoryName("");
    setNewCategorySlug("");
    setCategoryDialogOpen(false);
    
    toast({
      title: "Categoria adicionada",
      description: `${newCategoryName} foi adicionada com sucesso.`,
    });
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
      
      toast({
        title: "Categoria removida",
        description: "A categoria foi removida com sucesso.",
      });
    }
  };
  
  const handleAddSubcategory = () => {
    if (!selectedCategory || !newSubcategoryName || !newSubcategoryType) return;
    
    const category = getCurrentCategory();
    if (!category) return;
    
    // Verifica se já existe uma subcategoria com esse tipo na categoria atual
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
  
  const handleRemoveSubcategory = (subcategoryId: number) => {
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
  
  const category = getCurrentCategory();
  const subcategory = getCurrentSubcategory();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Categories Panel */}
      <Card className="md:col-span-1">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Categorias</h3>
              <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
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
                      disabled={!newCategoryName || !newCategorySlug}
                    >
                      Adicionar Categoria
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
      
      {/* Subcategories Panel */}
      <Card className="md:col-span-1">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">
                {category ? `Subcategorias: ${category.name}` : 'Subcategorias'}
              </h3>
              {category && (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" /> Nova
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
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
                      <button
                        className="flex items-center flex-1 text-left"
                        onClick={() => setSelectedSubcategory(subcat.id)}
                      >
                        <List className="h-4 w-4 mr-2" />
                        <span className="text-sm">{subcat.name}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({subcat.values.length})
                        </span>
                      </button>
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
      
      {/* Values Panel */}
      <Card className="md:col-span-1">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">
                {subcategory ? `Valores: ${subcategory.name}` : 'Valores'}
              </h3>
              {subcategory && (
                <div className="flex gap-2 items-center">
                  <Input
                    placeholder="Novo valor..."
                    value={newValueName}
                    onChange={(e) => setNewValueName(e.target.value)}
                    className="h-9 w-40"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleAddValue}
                    disabled={!newValueName}
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
    </div>
  );
};

export default CategoryManager;
