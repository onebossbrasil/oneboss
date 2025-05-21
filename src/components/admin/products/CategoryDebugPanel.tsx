
import React from "react";
import { useCategories } from "@/contexts/CategoryContext";

interface CategoryDebugPanelProps {
  selectedCategory: string;
  selectedSubcategoryId: string | null;
  selectedAttributeId: string | null;
}

const CategoryDebugPanel: React.FC<CategoryDebugPanelProps> = ({
  selectedCategory,
  selectedSubcategoryId,
  selectedAttributeId
}) => {
  const { categories } = useCategories();

  const category = categories.find(cat => cat.id === selectedCategory);
  
  return (
    <div className="bg-yellow-100 border border-yellow-400 rounded p-3 mt-4 text-xs text-yellow-900">
      <div className="font-bold mb-1">[DEBUG VISUAL]</div>
      <div>
        <strong>Categoria selecionada:</strong> {category ? `${category.name} (${category.id})` : String(selectedCategory)}
      </div>
      <div className="ml-2">
        <div>
          <strong>Subcategorias ({category?.subcategories.length ?? 0}):</strong>
        </div>
        <ul>
          {category && category.subcategories.length > 0 ? (
            category.subcategories.map(subcat => (
              <li key={subcat.id} className={subcat.id === selectedSubcategoryId ? "font-bold text-green-700" : ""}>
                └ {subcat.name} <span className="text-gray-500">({subcat.id})</span>
                <div className="ml-3">
                  <span className="italic text-gray-700">type: {subcat.type}</span>
                  <ul>
                    <li>
                      <span className="font-medium text-blue-700">Atributos ({subcat.attributes.length}):</span>
                      <ul>
                        {subcat.attributes.length > 0 ? (
                          subcat.attributes.map(attr => (
                            <li
                              key={attr.id}
                              className={attr.id === selectedAttributeId ? "text-indigo-700 font-bold" : ""}
                            >
                              • {attr.name} <span className="text-gray-400">({attr.id})</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-gray-400 italic">Nenhum atributo</li>
                        )}
                      </ul>
                    </li>
                  </ul>
                </div>
              </li>
            ))
          ) : (
            <li className="text-gray-400 italic">Nenhuma subcategoria</li>
          )}
        </ul>
      </div>
      <div className="mt-2 text-xs opacity-75">
        Painel debug: Mostra subcategorias e atributos carregados da categoria ativa. Atualize a categoria/subcategoria para ver mudanças.
      </div>
    </div>
  );
};

export default CategoryDebugPanel;

