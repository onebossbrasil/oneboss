import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { useCategories } from "@/contexts/CategoryContext";

export const useStoreFilters = () => {
  const { categories } = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const navigate = useNavigate();

  // Busca, filtro - prioriza slug da URL, depois parâmetro query
  const paramCategory = searchParams.get("category");
  const initCategoryId = useMemo(() => {
    console.log(`[useStoreFilters] ===== RESOLVENDO CATEGORIA INICIAL =====`);
    console.log(`[useStoreFilters] categorySlug da URL:`, categorySlug);
    console.log(`[useStoreFilters] paramCategory da query:`, paramCategory);
    console.log(`[useStoreFilters] Categorias disponíveis:`, categories.map(c => ({ id: c.id, name: c.name, value: c.value })));
    
    // 1. Se há slug na URL, procura por slug
    if (categorySlug) {
      const categoryBySlug = categories.find(c => c.value === categorySlug);
      console.log(`[useStoreFilters] Procurando categoria por slug "${categorySlug}":`, categoryBySlug);
      if (categoryBySlug) {
        console.log(`[useStoreFilters] ✅ Categoria encontrada por slug: ${categoryBySlug.name} (ID: ${categoryBySlug.id})`);
        return categoryBySlug.id;
      } else {
        console.log(`[useStoreFilters] ❌ Categoria NÃO encontrada por slug: ${categorySlug}`);
      }
    }
    
    // 2. Se há parâmetro query, procura por ID ou slug
    if (paramCategory) {
      const categoryById = categories.find(c => c.id === paramCategory);
      if (categoryById) {
        console.log(`[useStoreFilters] ✅ Categoria encontrada por ID: ${categoryById.name}`);
        return categoryById.id;
      }
      
      const categoryByValue = categories.find(c => c.value === paramCategory);
      if (categoryByValue) {
        console.log(`[useStoreFilters] ✅ Categoria encontrada por value: ${categoryByValue.name}`);
        return categoryByValue.id;
      }
    }
    
    console.log(`[useStoreFilters] ❌ Nenhuma categoria encontrada, retornando vazio`);
    return "";
  }, [categories, categorySlug, paramCategory]);

  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initCategoryId || null);
  const [selectedSubcategories, setSelectedSubcategories] = useState<any[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<any[]>([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(Number(searchParams.get("page")) || 1);
  const [sortOption, setSortOption] = useState<"relevance"|"price-asc"|"price-desc"|"newest">(searchParams.get("sort") as any || "relevance");

  // Atualiza categoria quando slug da URL mudar
  useEffect(() => {
    if (initCategoryId !== selectedCategory) {
      console.log(`[useStoreFilters] Atualizando categoria de ${selectedCategory} para ${initCategoryId}`);
      setSelectedCategory(initCategoryId || null);
      // Reset subcategorias e atributos quando categoria muda
      setSelectedSubcategories([]);
      setSelectedAttributes([]);
    }
  }, [initCategoryId, selectedCategory]);

  // Se há slug na URL mas não conseguiu resolver categoria, 
  // aplica o filtro usando o ID da categoria correspondente
  const effectiveCategoryId = useMemo(() => {
    if (selectedCategory) {
      console.log(`[useStoreFilters] ✅ Usando categoria resolvida: ${selectedCategory}`);
      return selectedCategory;
    }
    
    // Se há slug na URL mas não encontrou categoria no banco,
    // tenta buscar produtos que contenham palavras-chave relacionadas
    if (categorySlug && !selectedCategory) {
      console.log(`[useStoreFilters] ⚠️  Slug "${categorySlug}" não encontrou categoria correspondente`);
      
      // Para alguns slugs conhecidos, tenta encontrar categoria similar
      const slugMappings: { [key: string]: string[] } = {
        'veiculos': ['automoveis', 'carros', 'veiculos', 'motos'],
        'embarcacoes': ['barcos', 'lanchas', 'embarcacoes', 'nautico'],
        'aeronaves': ['avioes', 'helicopteros', 'aeronaves', 'aereo'],
        'imoveis': ['casas', 'apartamentos', 'imoveis', 'imobiliario'],
        'relogios': ['relogios', 'watches', 'cronometros'],
        'decoracao': ['decoracao', 'arte', 'design', 'objetos']
      };
      
      const possibleTerms = slugMappings[categorySlug] || [];
      
      // Tenta encontrar uma categoria que contenha algum dos termos
      for (const term of possibleTerms) {
        const matchingCategory = categories.find(c => 
          c.name.toLowerCase().includes(term) || 
          c.value.toLowerCase().includes(term)
        );
        if (matchingCategory) {
          console.log(`[useStoreFilters] ✅ Encontrou categoria similar: ${matchingCategory.name} para slug ${categorySlug}`);
          return matchingCategory.id;
        }
      }
      
      console.log(`[useStoreFilters] ❌ Nenhuma categoria similar encontrada para ${categorySlug} - mostrando todos os produtos`);
      return null;
    }
    
    return null;
  }, [selectedCategory, categorySlug]);

  // Debug: Log do estado atual sempre que mudar
  useEffect(() => {
    console.log(`[useStoreFilters] ===== ESTADO ATUAL DOS FILTROS =====`);
    console.log(`[useStoreFilters] Estados:`, {
      searchTerm,
      selectedCategory,
      selectedSubcategoriesCount: selectedSubcategories.length,
      selectedAttributesCount: selectedAttributes.length,
      currentPage,
      sortOption
    });
  }, [searchTerm, selectedCategory, selectedSubcategories, selectedAttributes, currentPage, sortOption]);

  // Sincronizar apenas parâmetros de busca, página e ordenação (não categoria)
  useEffect(() => {
    const newParams = new URLSearchParams();
    if (searchTerm) newParams.set("search", searchTerm);
    if (selectedSubcategories.length > 0) newParams.set("subcategories", selectedSubcategories.map(s => typeof s === 'string' ? s : s.id).join(","));
    if (selectedAttributes.length > 0) newParams.set("attributes", selectedAttributes.map(a => typeof a === 'string' ? a : a.id).join(","));
    if (currentPage > 1) newParams.set("page", currentPage.toString());
    if (sortOption && sortOption !== "relevance") newParams.set("sort", sortOption);
    setSearchParams(newParams, { replace: true });
    // eslint-disable-next-line
  }, [searchTerm, selectedSubcategories, selectedAttributes, currentPage, sortOption]);

  // Limpa todos filtros
  const resetFilters = () => {
    console.log(`[useStoreFilters] 🧹 LIMPANDO TODOS OS FILTROS`);
    navigate('/loja', { replace: true });
    setSearchTerm("");
    setSelectedCategory(null);
    setSelectedSubcategories([]);
    setSelectedAttributes([]);
    setCurrentPage(1);
    setSortOption("relevance");
  };

  // Handlers sidebar
  const handleCategorySelect = (catId: string | null) => {
    console.log(`[useStoreFilters] ===== CATEGORIA SELECIONADA =====`);
    console.log(`[useStoreFilters] Categoria anterior:`, selectedCategory);
    console.log(`[useStoreFilters] Nova categoria:`, catId);
    
    if (catId) {
      // Encontrar o slug da categoria e navegar para URL amigável
      const category = categories.find(c => c.id === catId);
      if (category) {
        console.log(`[useStoreFilters] Navegando para slug: ${category.value}`);
        navigate(`/loja/${category.value}`, { replace: true });
      }
    } else {
      // Se desmarcou a categoria, volta para loja geral
      console.log(`[useStoreFilters] Desmarcando categoria, voltando para /loja`);
      navigate('/loja', { replace: true });
    }
    
    setSelectedCategory(catId);
    setSelectedSubcategories([]);
    setSelectedAttributes([]);
    setCurrentPage(1);
    
    console.log(`[useStoreFilters] Estado atualizado - categoria:`, catId);
  };
  
  const handleSubcategoryToggle = (subcat: any) => {
    console.log(`[useStoreFilters] ===== SUBCATEGORIA TOGGLE =====`);
    console.log(`[useStoreFilters] Subcategoria:`, subcat);
    
    setSelectedSubcategories(prev => {
      console.log(`[useStoreFilters] Estado anterior subcategorias:`, prev);
      console.log(`[useStoreFilters] Subcategoria clicada:`, subcat);
      
      // Filtra apenas subcategorias da categoria atual para evitar problemas de timing
      const subcatsFromCurrentCategory = prev.filter((sc: any) => {
        // Buscar a categoria da subcategoria para validar
        const categoryFromSubcat = categories.find(cat => 
          cat.subcategories?.some(sub => sub.id === sc.id)
        );
        return categoryFromSubcat?.id === selectedCategory;
      });
      
      const isAlreadySelected = subcatsFromCurrentCategory.some((sc: any) => sc.id === subcat.id);
      console.log(`[useStoreFilters] Já selecionada?:`, isAlreadySelected);
      
      const newSelection = isAlreadySelected
        ? prev.filter((sc: any) => sc.id !== subcat.id)
        : [...prev, subcat];
      
      console.log(`[useStoreFilters] Nova seleção de subcategorias:`, newSelection);
      
      // Se subcategoria foi desmarcada, remover apenas seus atributos
      if (isAlreadySelected && subcat.attributes) {
        setSelectedAttributes(prevAttrs => {
          const subcatAttributeIds = subcat.attributes.map((attr: any) => attr.id);
          const filteredAttrs = prevAttrs.filter(attr => 
            !subcatAttributeIds.includes(typeof attr === 'string' ? attr : attr.id)
          );
          console.log(`[useStoreFilters] Atributos removidos da subcategoria ${subcat.name}:`, filteredAttrs);
          return filteredAttrs;
        });
      }
      
      return newSelection;
    });
    setCurrentPage(1);
  };

  const handleAttributeToggle = (attribute: any) => {
    console.log(`[useStoreFilters] ===== ATRIBUTO TOGGLE =====`);
    console.log(`[useStoreFilters] Atributo:`, attribute);
    setSelectedAttributes(prev => {
      const isAlreadySelected = prev.some((attr: any) => attr.id === attribute.id);
      const newSelection = isAlreadySelected
        ? prev.filter((attr: any) => attr.id !== attribute.id)
        : [...prev, attribute];
      
      console.log(`[useStoreFilters] Nova seleção de atributos:`, newSelection);
      return newSelection;
    });
    setCurrentPage(1);
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory: effectiveCategoryId, // Usa categoria efetiva
    selectedSubcategories,
    selectedAttributes,
    isMobileFiltersOpen,
    setIsMobileFiltersOpen,
    currentPage,
    setCurrentPage,
    sortOption,
    setSortOption,
    resetFilters,
    handleCategorySelect,
    handleSubcategoryToggle,
    handleAttributeToggle
  };
};
