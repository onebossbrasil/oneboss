
import { useCategories } from "@/contexts/CategoryContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";

type CategorySelectorProps = {
  selectedCategory: string;
  subcategoryValues: Record<string, string>;
  selectedSubcategoryId?: string | null;
  selectedAttributeId?: string | null;
  onCategoryChange: (value: string) => void;
  onSubcategoryChange: (type: string, value: string) => void;
  onSubcategoryIdChange?: (subcategoryId: string | null) => void;
  onAttributeIdChange?: (attributeId: string | null) => void;
};

// Helper function to ensure we always have a valid string for selectedAttributeId
const sanitizeAttributeId = (value: any): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") {
    console.warn("[CategorySelector] selectedAttributeId is an object, converting to empty string:", value);
    return "";
  }
  return String(value);
};

const CategorySelectorContent = ({
  selectedCategory,
  subcategoryValues,
  selectedSubcategoryId,
  selectedAttributeId,
  onCategoryChange,
  onSubcategoryChange,
  onSubcategoryIdChange,
  onAttributeIdChange
}: CategorySelectorProps) => {
  const { categories, isLoading, error } = useCategories();

  const category = categories.find(cat => cat.id === selectedCategory);

  // Busca subcategoria ativa pelo id
  const activeSubcatObj = category?.subcategories.find(
    sc => sc.id === selectedSubcategoryId
  );

  // Sanitize selectedAttributeId to ensure it's always a string
  const sanitizedAttributeId = sanitizeAttributeId(selectedAttributeId);

  // LOGS DE DIAGNÓSTICO
  if (process.env.NODE_ENV !== "production") {
    console.log("[CategorySelector] categories:", categories);
    console.log("[CategorySelector] selectedCategory:", selectedCategory);
    console.log("[CategorySelector] selectedSubcategoryId:", selectedSubcategoryId);
    console.log("[CategorySelector] selectedAttributeId (raw):", selectedAttributeId);
    console.log("[CategorySelector] selectedAttributeId (sanitized):", sanitizedAttributeId);
    console.log("[CategorySelector] activeSubcatObj:", activeSubcatObj);
    if (activeSubcatObj) {
      console.log("[CategorySelector] activeSubcatObj.attributes:", activeSubcatObj.attributes);
    }
  }

  // Quando muda subcategoria, notifica parent e configura atributo padrão
  useEffect(() => {
    if (onSubcategoryIdChange) {
      onSubcategoryIdChange(selectedSubcategoryId ?? null);
    }
    
    // Se há uma subcategoria ativa com atributos
    if (
      onAttributeIdChange &&
      activeSubcatObj &&
      selectedSubcategoryId &&
      activeSubcatObj.attributes &&
      activeSubcatObj.attributes.length > 0
    ) {
      // Verifica se o atributo atual é válido
      const currentAttributeExists = activeSubcatObj.attributes.some(a => a.id === sanitizedAttributeId);
      
      // Se não há atributo selecionado ou o atual não existe na lista, seleciona o primeiro
      if (!sanitizedAttributeId || !currentAttributeExists) {
        console.log("[CategorySelector] Setting default attribute:", activeSubcatObj.attributes[0].id);
        onAttributeIdChange(activeSubcatObj.attributes[0].id);
      }
    }
    // eslint-disable-next-line
  }, [selectedSubcategoryId, activeSubcatObj]);

  if (isLoading) {
    return <div className="space-y-4">Carregando categorias...</div>;
  }

  if (error) {
    return <div className="text-red-500">Erro ao carregar categorias: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="category">Categoria</Label>
        <Select 
          onValueChange={(catId) => {
            onCategoryChange(catId);
            if (onSubcategoryIdChange) onSubcategoryIdChange(null);
            if (onAttributeIdChange) onAttributeIdChange(null);
          }}
          value={selectedCategory}
          disabled={categories.length === 0}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem 
                key={category.id} 
                value={category.id}
              >
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCategory && (
        <div>
          <Label htmlFor="subcategoryId">Subcategoria</Label>
          <Select 
            onValueChange={(subcatId) => {
              if (onSubcategoryIdChange) onSubcategoryIdChange(subcatId);
              if (onAttributeIdChange) onAttributeIdChange(null);
            }}
            value={selectedSubcategoryId ?? ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma subcategoria" />
            </SelectTrigger>
            <SelectContent>
              {category
                ? category.subcategories.map(sc => (
                  <SelectItem key={sc.id} value={sc.id}>
                    {sc.name}
                  </SelectItem>
                ))
                : null}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Modal de atributos - corrigido para garantir que o valor seja sempre string */}
      {selectedSubcategoryId && activeSubcatObj && Array.isArray(activeSubcatObj.attributes) && activeSubcatObj.attributes.length > 0 && (
        <div>
          <Label htmlFor="subcategoryValue">
            {activeSubcatObj.name + " - Atributos"}
          </Label>
          <Select 
            onValueChange={(attributeId) => {
              console.log("[CategorySelector] Attribute selected:", attributeId);
              if (onAttributeIdChange) {
                onAttributeIdChange(attributeId);
              }
            }}
            value={sanitizedAttributeId}
            disabled={activeSubcatObj.attributes.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                `Selecione um atributo para ${activeSubcatObj.name.toLowerCase()}`
              } />
            </SelectTrigger>
            <SelectContent>
              {activeSubcatObj.attributes.map((attr: { id: string; name: string; }) => {
                console.log("[CategorySelector] Rendering attribute option:", attr);
                return (
                  <SelectItem key={attr.id} value={attr.id}>
                    {attr.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Mensagem, caso não haja atributos */}
      {selectedSubcategoryId && activeSubcatObj && (!activeSubcatObj.attributes || activeSubcatObj.attributes.length === 0) && (
        <div className="text-sm text-muted-foreground italic">
          Esta subcategoria não possui atributos cadastrados.
        </div>
      )}
    </div>
  );
};

const CategorySelector = (props: CategorySelectorProps) => {
  return <CategorySelectorContent {...props} />;
};

export default CategorySelector;
