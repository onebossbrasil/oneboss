
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Folder, List, Plus, Trash2 } from "lucide-react";

// Mock data for categories and subcategories
const initialCategories = [
  { 
    id: 1,
    name: "Automóveis", 
    value: "automoveis",
    subcategories: [
      { id: 1, name: "Marca do Veículo", type: "marca", values: ["BMW", "Mercedes", "Audi", "Ferrari"] },
      { id: 2, name: "Modelo", type: "modelo", values: ["Sedan", "SUV", "Conversível"] }
    ]
  },
  { 
    id: 2,
    name: "Imóveis", 
    value: "imoveis",
    subcategories: [
      { id: 3, name: "Localização", type: "localizacao", values: ["São Paulo", "Rio de Janeiro", "Belo Horizonte"] },
      { id: 4, name: "Tipo", type: "tipo", values: ["Residencial", "Comercial"] },
      { id: 5, name: "Modelo", type: "modelo", values: ["Casa", "Apartamento", "Cobertura"] }
    ]
  },
  { 
    id: 3,
    name: "Relógios", 
    value: "relogios",
    subcategories: [
      { id: 6, name: "Marcas", type: "marca", values: ["Rolex", "Omega", "Tag Heuer", "Patek Philippe"] }
    ]
  },
  { 
    id: 4,
    name: "Decoração", 
    value: "decoracao",
    subcategories: [
      { id: 7, name: "Tipo", type: "tipo", values: ["Quadros", "Esculturas", "Itens de Decoração"] }
    ]
  },
  { 
    id: 5,
    name: "Aeronaves", 
    value: "aeronaves",
    subcategories: [
      { id: 8, name: "Marcas", type: "marca", values: ["Cessna", "Embraer", "Bombardier"] },
      { id: 9, name: "Modelos", type: "modelo", values: ["Bimotor", "Turbo Hélice", "Jato"] }
    ]
  },
  { 
    id: 6,
    name: "Embarcações", 
    value: "embarcacoes",
    subcategories: [
      { id: 10, name: "Marcas", type: "marca", values: ["Azimut", "Ferretti", "Intermarine"] },
      { id: 11, name: "Pés", type: "pes", values: ["30 pés", "40 pés", "50 pés", "60+ pés"] },
      { id: 12, name: "Modelo", type: "modelo", values: ["Iate", "Lancha", "Barco"] }
    ]
  }
];

const CategoryManager = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [newSubcategoryType, setNewSubcategoryType] = useState("");
  const [newValueName, setNewValueName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const getCurrentCategory = () => {
    return categories.find(cat => cat.value === selectedCategory) || null;
  };
  
  const getCurrentSubcategory = () => {
    const category = getCurrentCategory();
    if (!category || selectedSubcategory === null) return null;
    return category.subcategories.find(subcat => subcat.id === selectedSubcategory) || null;
  };
  
  const handleAddSubcategory = () => {
    if (!selectedCategory || !newSubcategoryName || !newSubcategoryType) return;
    
    const updatedCategories = [...categories];
    const categoryIndex = updatedCategories.findIndex(cat => cat.value === selectedCategory);
    
    if (categoryIndex === -1) return;
    
    const newId = Math.max(0, ...categories.flatMap(c => c.subcategories.map(sc => sc.id))) + 1;
    
    updatedCategories[categoryIndex].subcategories.push({
      id: newId,
      name: newSubcategoryName,
      type: newSubcategoryType,
      values: []
    });
    
    setCategories(updatedCategories);
    setNewSubcategoryName("");
    setNewSubcategoryType("");
    
    toast({
      title: "Subcategoria adicionada",
      description: `${newSubcategoryName} foi adicionada com sucesso.`,
    });
  };
  
  const handleAddValue = () => {
    if (!selectedCategory || selectedSubcategory === null || !newValueName) return;
    
    const updatedCategories = [...categories];
    const categoryIndex = updatedCategories.findIndex(cat => cat.value === selectedCategory);
    
    if (categoryIndex === -1) return;
    
    const subcategoryIndex = updatedCategories[categoryIndex].subcategories.findIndex(
      sc => sc.id === selectedSubcategory
    );
    
    if (subcategoryIndex === -1) return;
    
    if (!updatedCategories[categoryIndex].subcategories[subcategoryIndex].values.includes(newValueName)) {
      updatedCategories[categoryIndex].subcategories[subcategoryIndex].values.push(newValueName);
      
      setCategories(updatedCategories);
      setNewValueName("");
      
      toast({
        title: "Valor adicionado",
        description: `${newValueName} foi adicionado com sucesso.`,
      });
    } else {
      toast({
        title: "Valor duplicado",
        description: "Este valor já existe nesta subcategoria.",
        variant: "destructive",
      });
    }
  };
  
  const handleRemoveValue = (value: string) => {
    if (!selectedCategory || selectedSubcategory === null) return;
    
    const updatedCategories = [...categories];
    const categoryIndex = updatedCategories.findIndex(cat => cat.value === selectedCategory);
    
    if (categoryIndex === -1) return;
    
    const subcategoryIndex = updatedCategories[categoryIndex].subcategories.findIndex(
      sc => sc.id === selectedSubcategory
    );
    
    if (subcategoryIndex === -1) return;
    
    updatedCategories[categoryIndex].subcategories[subcategoryIndex].values = 
      updatedCategories[categoryIndex].subcategories[subcategoryIndex].values.filter(v => v !== value);
    
    setCategories(updatedCategories);
    
    toast({
      title: "Valor removido",
      description: `${value} foi removido com sucesso.`,
    });
  };
  
  const handleRemoveSubcategory = (subcategoryId: number) => {
    if (!selectedCategory) return;
    
    const updatedCategories = [...categories];
    const categoryIndex = updatedCategories.findIndex(cat => cat.value === selectedCategory);
    
    if (categoryIndex === -1) return;
    
    updatedCategories[categoryIndex].subcategories = 
      updatedCategories[categoryIndex].subcategories.filter(sc => sc.id !== subcategoryId);
    
    setCategories(updatedCategories);
    setSelectedSubcategory(null);
    
    toast({
      title: "Subcategoria removida",
      description: "A subcategoria foi removida com sucesso.",
    });
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
              <Dialog>
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
                      <Input id="new-category" placeholder="Ex: Jóias" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-category-slug">Identificador (slug)</Label>
                      <Input id="new-category-slug" placeholder="Ex: joias" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Adicionar Categoria</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`flex items-center w-full p-2 rounded-md hover:bg-accent ${
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
                        onClick={() => {
                          handleAddSubcategory();
                          setDialogOpen(false);
                        }}
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
                        onClick={() => handleRemoveSubcategory(subcat.id)}
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
