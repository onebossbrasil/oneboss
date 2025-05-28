
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface StoreSearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setCurrentPage: (page: number) => void;
  hasActiveFilters: boolean;
  resetFilters: () => void;
}

const StoreSearchBar = ({
  searchTerm,
  setSearchTerm,
  setCurrentPage,
  hasActiveFilters,
  resetFilters
}: StoreSearchBarProps) => {
  return (
    <form 
      onSubmit={e => { 
        e.preventDefault(); 
        setCurrentPage(1); 
      }} 
      className="w-full flex items-center gap-2 mb-6"
    >
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar produtos..."
          className="pl-9"
          value={searchTerm}
          onChange={e => { 
            setSearchTerm(e.target.value); 
            setCurrentPage(1); 
          }}
          autoFocus
        />
      </div>
      {hasActiveFilters && (
        <Button
          type="button"
          variant="ghost"
          className="text-muted-foreground"
          onClick={resetFilters}
        >
          Limpar filtros
        </Button>
      )}
    </form>
  );
};

export default StoreSearchBar;
