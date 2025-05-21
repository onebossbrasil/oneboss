
import React from "react";
import { CategoryType } from "@/types/category";

type CategoryFilterProps = {
  categories: CategoryType[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
};

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <select
      value={selectedCategory}
      onChange={e => onCategoryChange(e.target.value)}
      className="border rounded px-4 py-2 min-w-[140px] text-sm"
    >
      <option value="">Todas categorias</option>
      {categories.map(category => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  );
};

export default CategoryFilter;
