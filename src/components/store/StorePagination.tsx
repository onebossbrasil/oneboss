
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StorePaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const StorePagination = ({ currentPage, totalPages, setCurrentPage }: StorePaginationProps) => {
  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top suavemente
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="mt-12 flex justify-center">
      <nav className="flex items-center gap-1" aria-label="Paginação">
        {/* Botão Anterior */}
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Página anterior</span>
        </Button>

        {/* Páginas */}
        <div className="hidden sm:flex items-center gap-1">
          {visiblePages.map((page, index) => (
            page === '...' ? (
              <span key={`dots-${index}`} className="px-2 py-1 text-muted-foreground">
                ...
              </span>
            ) : (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                className={`h-9 w-9 ${
                  currentPage === page 
                    ? "bg-gold text-white hover:bg-gold/90" 
                    : "border-gold/20 hover:border-gold hover:bg-gold/10"
                }`}
                onClick={() => handlePageChange(page as number)}
              >
                {page}
              </Button>
            )
          ))}
        </div>

        {/* Mobile: apenas página atual */}
        <div className="sm:hidden px-3 py-1 text-sm text-muted-foreground">
          {currentPage} de {totalPages}
        </div>

        {/* Botão Próximo */}
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Próxima página</span>
        </Button>
      </nav>
    </div>
  );
};

export default StorePagination;
