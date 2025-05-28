
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ResultsHeaderProps = {
  productCount: number;
  sortOption: string;
  setSortOption: (s: any) => void;
};

const ResultsHeader = ({ productCount, sortOption, setSortOption }: ResultsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 bg-white/50 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-gold/10">
      <div className="flex-1">
        <p className="text-sm md:text-base text-muted-foreground">
          {productCount === 0 
            ? "Nenhum produto encontrado"
            : productCount === 1
            ? "1 produto encontrado"
            : `${productCount} produtos encontrados`
          }
        </p>
      </div>
      
      <div className="flex items-center gap-3 min-w-0 sm:min-w-[200px]">
        <span className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">
          Ordenar por:
        </span>
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-full sm:w-[160px] border-gold/20 focus:border-gold">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevância</SelectItem>
            <SelectItem value="price-asc">Menor preço</SelectItem>
            <SelectItem value="price-desc">Maior preço</SelectItem>
            <SelectItem value="newest">Mais recentes</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ResultsHeader;
