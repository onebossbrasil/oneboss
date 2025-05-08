
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SearchBarProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  toggleMobileFilters: () => void;
};

const SearchBar = ({ searchQuery, setSearchQuery, toggleMobileFilters }: SearchBarProps) => {
  return (
    <div className="flex items-center justify-between mb-6 md:mb-8 gap-2 md:gap-4">
      <div className="relative flex-grow max-w-full md:max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 md:h-5 w-4 md:w-5" />
        <Input
          type="text"
          placeholder="Buscar produtos..."
          className="pl-10 border-gold/20 focus-visible:ring-gold/30 text-sm md:text-base"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Button
        variant="outline"
        className="md:hidden border-gold/30 text-gold"
        onClick={toggleMobileFilters}
      >
        <Filter className="h-4 w-4 mr-1 md:mr-2" />
        Filtros
      </Button>
    </div>
  );
};

export default SearchBar;
