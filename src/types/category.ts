
export type SubcategoryType = {
  id: string; // Apenas string UUID
  name: string;
  type: string;
  values: string[];
};

export type CategoryType = {
  id: string; // Apenas string UUID
  name: string;
  value: string;
  subcategories: SubcategoryType[];
};
