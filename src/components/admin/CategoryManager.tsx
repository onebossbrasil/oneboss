
import { useState } from "react";
import CategoryList from "./categories/CategoryList";
import SubcategoryList from "./categories/SubcategoryList";
import ValueList from "./categories/ValueList";

const CategoryManager = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Categories Panel */}
      <CategoryList 
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        setSelectedSubcategory={setSelectedSubcategory}
      />
      
      {/* Subcategories Panel */}
      <SubcategoryList 
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        setSelectedSubcategory={setSelectedSubcategory}
      />
      
      {/* Values Panel */}
      <ValueList 
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
      />
    </div>
  );
};

export default CategoryManager;
