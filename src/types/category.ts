
export type SubcategoryType = {
  id: number | string;
  name: string;
  type: string;
  values: string[];
};

export type CategoryType = {
  id: number | string;
  name: string;
  value: string;
  subcategories: SubcategoryType[];
};
