
// Refatorado para usar sub-componentes e hook de lógica

import { useCategories, CategoryType, SubcategoryType } from "@/contexts/CategoryContext";
import { AttributeType } from "@/types/category";
import AttributeListDisplay from "@/components/categories/AttributeListDisplay";
import AttributeAddForm from "./AttributeAddForm";
import AttributeListHeader from "./AttributeListHeader";
import { Card, CardContent } from "@/components/ui/card";
import { useAttributeListLogic } from "./useAttributeListLogic";

type AttributeListProps = {
  selectedCategory: string | null;
  selectedSubcategory: string | null;
};

const AttributeList = ({
  selectedCategory,
  selectedSubcategory,
}: AttributeListProps) => {
  const { categories, addSubcategoryValue, removeSubcategoryValue } = useCategories();

  const getCurrentCategory = (): CategoryType | null =>
    categories.find(cat => cat.value === selectedCategory) || null;
  const getCurrentSubcategory = (): SubcategoryType | null => {
    const cat = getCurrentCategory();
    if (!cat || !selectedSubcategory) return null;
    return cat.subcategories.find(subcat => subcat.id === selectedSubcategory) || null;
  };

  const category = getCurrentCategory();
  const subcategory = getCurrentSubcategory();

  const logic = useAttributeListLogic({
    selectedCategory,
    selectedSubcategory,
    category,
    subcategory,
    addSubcategoryValue,
    removeSubcategoryValue,
  });

  return (
    <Card className="md:col-span-1 w-full md:w-[120%]">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <AttributeListHeader
            subcategoryName={subcategory?.name}
            canAdd={!!subcategory}
            adding={logic.adding}
            setAdding={logic.setAdding}
          />
          {logic.adding && subcategory && (
            <AttributeAddForm
              value={logic.newAttributeName}
              setValue={logic.setNewAttributeName}
              onConfirm={logic.handleAddAttribute}
              onCancel={() => {
                logic.setAdding(false);
                logic.setNewAttributeName("");
              }}
              loading={false}
            />
          )}
          {subcategory ? (
            <div className="space-y-2">
              {subcategory.attributes.length > 0 ? (
                <AttributeListDisplay
                  attributes={subcategory.attributes}
                  selectedAttributes={logic.selectedAttributes}
                  onAttributeToggle={logic.handleAttributeToggle}
                  editable
                  onEdit={attr => {
                    const index = subcategory.attributes.findIndex(a => a.id === attr.id);
                    logic.setEditIndex(index);
                    logic.setEditValue(attr.name);
                  }}
                  onDelete={logic.handleRemoveAttribute}
                />
              ) : (
                <p className="text-sm text-muted-foreground py-2">
                  Nenhum atributo encontrado. Adicione novos atributos para esta subcategoria.
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-2">
              Selecione uma subcategoria para gerenciar seus atributos.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AttributeList;
