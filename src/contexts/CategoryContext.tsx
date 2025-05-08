
import React, { createContext, useContext, useState, useEffect } from "react";

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

type CategoryContextType = {
  categories: CategoryType[];
  addCategory: (name: string, value: string) => void;
  removeCategory: (categoryId: number) => void;
  addSubcategory: (categoryId: number, name: string, type: string) => void;
  removeSubcategory: (categoryId: number, subcategoryId: number) => void;
  addSubcategoryValue: (categoryId: number, subcategoryId: number, value: string) => void;
  removeSubcategoryValue: (categoryId: number, subcategoryId: number, value: string) => void;
};

// Mock data inicial
const initialCategories: CategoryType[] = [
  { 
    id: 1,
    name: "Automóveis", 
    value: "automoveis",
    subcategories: [
      { id: 1, name: "Marca do Veículo", type: "marca", values: ["BMW", "Mercedes", "Audi", "Ferrari"] },
      { id: 2, name: "Modelo", type: "modelo", values: ["Sedan", "SUV", "Conversível"] }
    ]
  },
  { 
    id: 2,
    name: "Imóveis", 
    value: "imoveis",
    subcategories: [
      { id: 3, name: "Localização", type: "localizacao", values: ["São Paulo", "Rio de Janeiro", "Belo Horizonte"] },
      { id: 4, name: "Tipo", type: "tipo", values: ["Residencial", "Comercial"] },
      { id: 5, name: "Modelo", type: "modelo", values: ["Casa", "Apartamento", "Cobertura"] }
    ]
  },
  { 
    id: 3,
    name: "Relógios", 
    value: "relogios",
    subcategories: [
      { id: 6, name: "Marcas", type: "marca", values: ["Rolex", "Omega", "Tag Heuer", "Patek Philippe"] }
    ]
  },
  { 
    id: 4,
    name: "Decoração", 
    value: "decoracao",
    subcategories: [
      { id: 7, name: "Tipo", type: "tipo", values: ["Quadros", "Esculturas", "Itens de Decoração"] }
    ]
  },
  { 
    id: 5,
    name: "Aeronaves", 
    value: "aeronaves",
    subcategories: [
      { id: 8, name: "Marcas", type: "marca", values: ["Cessna", "Embraer", "Bombardier"] },
      { id: 9, name: "Modelos", type: "modelo", values: ["Bimotor", "Turbo Hélice", "Jato"] }
    ]
  },
  { 
    id: 6,
    name: "Embarcações", 
    value: "embarcacoes",
    subcategories: [
      { id: 10, name: "Marcas", type: "marca", values: ["Azimut", "Ferretti", "Intermarine"] },
      { id: 11, name: "Pés", type: "pes", values: ["30 pés", "40 pés", "50 pés", "60+ pés"] },
      { id: 12, name: "Modelo", type: "modelo", values: ["Iate", "Lancha", "Barco"] }
    ]
  }
];

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<CategoryType[]>(() => {
    // Tenta recuperar do localStorage, se existir
    const savedCategories = localStorage.getItem("categories");
    return savedCategories ? JSON.parse(savedCategories) : initialCategories;
  });

  // Salva qualquer alteração no localStorage
  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  // Encontra o próximo ID disponível para novas categorias
  const getNextCategoryId = () => {
    return Math.max(0, ...categories.map(c => c.id)) + 1;
  };

  // Encontra o próximo ID disponível para novas subcategorias
  const getNextSubcategoryId = () => {
    return Math.max(0, ...categories.flatMap(c => c.subcategories.map(sc => sc.id))) + 1;
  };

  // Adiciona uma nova categoria
  const addCategory = (name: string, value: string) => {
    const newCategory: CategoryType = {
      id: getNextCategoryId(),
      name,
      value,
      subcategories: []
    };
    
    setCategories([...categories, newCategory]);
  };

  // Remove uma categoria
  const removeCategory = (categoryId: number) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
  };

  // Adiciona uma nova subcategoria
  const addSubcategory = (categoryId: number, name: string, type: string) => {
    setCategories(categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          subcategories: [
            ...cat.subcategories,
            { id: getNextSubcategoryId(), name, type, values: [] }
          ]
        };
      }
      return cat;
    }));
  };

  // Remove uma subcategoria
  const removeSubcategory = (categoryId: number, subcategoryId: number) => {
    setCategories(categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          subcategories: cat.subcategories.filter(sc => sc.id !== subcategoryId)
        };
      }
      return cat;
    }));
  };

  // Adiciona um valor a uma subcategoria
  const addSubcategoryValue = (categoryId: number, subcategoryId: number, value: string) => {
    setCategories(categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          subcategories: cat.subcategories.map(sc => {
            if (sc.id === subcategoryId && !sc.values.includes(value)) {
              return {
                ...sc,
                values: [...sc.values, value]
              };
            }
            return sc;
          })
        };
      }
      return cat;
    }));
  };

  // Remove um valor de uma subcategoria
  const removeSubcategoryValue = (categoryId: number, subcategoryId: number, value: string) => {
    setCategories(categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          subcategories: cat.subcategories.map(sc => {
            if (sc.id === subcategoryId) {
              return {
                ...sc,
                values: sc.values.filter(v => v !== value)
              };
            }
            return sc;
          })
        };
      }
      return cat;
    }));
  };

  return (
    <CategoryContext.Provider value={{
      categories,
      addCategory,
      removeCategory,
      addSubcategory,
      removeSubcategory,
      addSubcategoryValue,
      removeSubcategoryValue
    }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
};
