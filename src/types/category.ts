
// Definindo o tipo para um atributo (com id e name)
export type AttributeType = {
  id: string;
  name: string;
};

export type SubcategoryType = {
  id: string; // Apenas string UUID
  name: string;
  type: string;
  attributes: AttributeType[]; // Agora um array de objetos AttributeType
};

export type CategoryType = {
  id: string; // Apenas string UUID
  name: string;
  value: string;
  subcategories: SubcategoryType[];
};
