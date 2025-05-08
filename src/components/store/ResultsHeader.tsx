
type ResultsHeaderProps = {
  productCount: number;
};

const ResultsHeader = ({ productCount }: ResultsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4 sm:gap-0">
      <p className="text-xs md:text-sm text-muted-foreground">
        {productCount} produtos encontrados
      </p>
      <div className="flex items-center space-x-2">
        <span className="text-xs md:text-sm text-muted-foreground">Ordenar por:</span>
        <select className="text-xs md:text-sm border-gold/20 rounded p-1 bg-transparent">
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
