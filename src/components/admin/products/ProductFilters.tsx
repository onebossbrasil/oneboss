
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  categoryOptions: { id: string; name: string }[];
  status: string;
  onStatusChange: (value: string) => void;
}

const ALL_CATEGORIES = "__ALL__";
const ALL_STATUS = "__ALL__";

const ProductFilters: React.FC<ProductFiltersProps> = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categoryOptions,
  status,
  onStatusChange,
}) => (
  <div className="flex flex-col sm:flex-row gap-4 w-full max-w-5xl mx-auto px-2 mb-7 animate-fade-in">
    <Input
      type="text"
      placeholder="Buscar por nome do produto..."
      value={search}
      onChange={e => onSearchChange(e.target.value)}
      className="flex-1 min-w-0"
    />
    <Select
      value={category === "" ? ALL_CATEGORIES : category}
      onValueChange={v => onCategoryChange(v === ALL_CATEGORIES ? "" : v)}
    >
      <SelectTrigger className="min-w-[180px]">
        <SelectValue placeholder="Categoria" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_CATEGORIES}>Todas categorias</SelectItem>
        {categoryOptions.map(cat => (
          <SelectItem key={cat.id} value={cat.id}>
            {cat.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    <Select
      value={status === "" ? ALL_STATUS : status}
      onValueChange={v => onStatusChange(v === ALL_STATUS ? "" : v)}
    >
      <SelectTrigger className="min-w-[150px]">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_STATUS}>Todos status</SelectItem>
        <SelectItem value="published">Publicado</SelectItem>
        <SelectItem value="unpublished">Não publicado</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

export default ProductFilters;

