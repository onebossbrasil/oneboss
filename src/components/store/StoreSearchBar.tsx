
import React from "react";
import { Search, X } from "lucide-react";
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
  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="w-full mb-6">
      <form 
        onSubmit={e => { 
          e.preventDefault(); 
          setCurrentPage(1); 
        }} 
        className="flex items-center gap-2"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="search"
            placeholder="Buscar produtos..."
            className="pl-10 pr-10 h-11 border-gold/20 focus:border-gold focus-visible:ring-gold/30"
            value={searchTerm}
            onChange={e => { 
              setSearchTerm(e.target.value); 
              setCurrentPage(1); 
            }}
          />
          {searchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
              onClick={handleClearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {hasActiveFilters && (
          <Button
            type="button"
            variant="outline"
            className="border-gold/30 text-gold hover:bg-gold/10 whitespace-nowrap"
            onClick={resetFilters}
          >
            Limpar filtros
          </Button>
        )}
      </form>
    </div>
  );
};

export default StoreSearchBar;
