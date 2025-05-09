
export type SubcategoryType = {
  id: number;
  name: string;
  type: string;
  values: string[];
};

export type CategoryType = {
  id: number;
  name: string;
  value: string;
  subcategories: SubcategoryType[];
};
