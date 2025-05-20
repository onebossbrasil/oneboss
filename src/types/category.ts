
export type SubcategoryType = {
  id: string; // Apenas string UUID
  name: string;
  type: string;
  attributes: string[]; // lista de possíveis atributos p/ essa subcategoria
};

export type CategoryType = {
  id: string; // Apenas string UUID
  name: string;
  value: string;
  subcategories: SubcategoryType[];
};
