
import { CategoryType, SubcategoryType } from "./category";

export interface CategoryContextType {
  categories: CategoryType[];
  isLoading: boolean;
  error: string | null;
  addCategory: (name: string, value: string) => Promise<void>;
  removeCategory: (categoryId: string) => Promise<void>;
  addSubcategory: (categoryId: string, name: string, type: string) => Promise<void>;
  removeSubcategory: (categoryId: string, subcategoryId: string) => Promise<void>;
  addSubcategoryValue: (categoryId: string, subcategoryId: string, value: string) => Promise<void>;
  removeSubcategoryValue: (categoryId: string, subcategoryId: string, value: string) => Promise<void>;
  refreshCategories: () => Promise<void>;
}
