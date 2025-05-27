
type ResultsHeaderProps = {
  productCount: number;
  sortOption: string;
  setSortOption: (s: any) => void;
};

const ResultsHeader = ({ productCount, sortOption, setSortOption }: ResultsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 sm:gap-0">
      <p className="text-xs md:text-sm text-muted-foreground">
        {productCount === 1
          ? "1 produto encontrado"
          : `${productCount} produtos encontrados`}
      </p>
      <div className="flex items-center space-x-2">
        <span className="text-xs md:text-sm text-muted-foreground">Ordenar por:</span>
        <select
          value={sortOption}
          onChange={e => setSortOption(e.target.value)}
          className="text-xs md:text-sm border-gold/20 rounded p-1 bg-transparent"
        >
          <option value="relevance">Relevância</option>
          <option value="price-asc">Menor preço</option>
          <option value="price-desc">Maior preço</option>
          <option value="newest">Mais recentes</option>
        </select>
      </div>
    </div>
  );
};

export default ResultsHeader;
