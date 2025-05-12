
import { CategoryType, SubcategoryType } from "./category";

export interface CategoryContextType {
  categories: CategoryType[];
  isLoading: boolean;
  error: string | null;
  addCategory: (name: string, value: string) => Promise<void>;
  removeCategory: (categoryId: number) => Promise<void>;
  addSubcategory: (categoryId: number, name: string, type: string) => Promise<void>;
  removeSubcategory: (categoryId: number, subcategoryId: number) => Promise<void>;
  addSubcategoryValue: (categoryId: number, subcategoryId: number, value: string) => Promise<void>;
  removeSubcategoryValue: (categoryId: number, subcategoryId: number, value: string) => Promise<void>;
  refreshCategories: () => Promise<void>;
}
