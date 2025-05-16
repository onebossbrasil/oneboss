
export type SubcategoryType = {
  id: string; // Apenas string UUID
  name: string;
  type: string;
  values: string[]; // rename to 'attributes' in future refactor
};

export type CategoryType = {
  id: string; // Apenas string UUID
  name: string;
  value: string;
  subcategories: SubcategoryType[];
};
