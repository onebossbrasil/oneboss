
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { updateSubcategoryValue } from "@/services/category/valueOperations";
import { AttributeType } from "@/types/category";
import { CategoryType, SubcategoryType } from "@/contexts/CategoryContext";

type Props = {
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  category: CategoryType | null;
  subcategory: SubcategoryType | null;
  addSubcategoryValue: (categoryId: string, subcategoryId: string, value: string) => Promise<void>;
  removeSubcategoryValue: (categoryId: string, subcategoryId: string, attributeId: string) => Promise<void>;
};

export function useAttributeListLogic({
  selectedCategory,
  selectedSubcategory,
  category,
  subcategory,
  addSubcategoryValue,
  removeSubcategoryValue,
}: Props) {
  const { toast } = useToast();
  const [newAttributeName, setNewAttributeName] = useState("");
  const [adding, setAdding] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<AttributeType[]>([]);

  const attributeNameExists = (name: string) =>
    subcategory?.attributes.some(attr => attr.name === name);

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

  const handleAttributeToggle = (attr: AttributeType) => {
    setSelectedAttributes((prev) =>
      prev.some((a) => a.id === attr.id)
        ? prev.filter((a) => a.id !== attr.id)
        : [...prev, attr]
    );
  };

  return {
    newAttributeName,
    setNewAttributeName,
    adding,
    setAdding,
    editIndex,
    setEditIndex,
    editValue,
    setEditValue,
    savingEdit,
    selectedAttributes,
    setSelectedAttributes,
    handleAddAttribute,
    handleRemoveAttribute,
    handleEditAttribute,
    handleAttributeToggle,
  };
}
