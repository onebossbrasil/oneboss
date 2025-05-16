
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Novo algoritmo de páginação — evita repetição dos números
function getPages(current: number, total: number) {
  // Mostra sempre a primeira e última página, as 2 ao redor da atual, e usa "..." quando necessário
  if (total <= 7) {
    // Se tem poucas páginas, mostra todas
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | string)[] = [];
  pages.push(1);

  if (current > 4) pages.push("...");

  // Determina o range central
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 3) pages.push("...");

  pages.push(total);

  return pages;
}

type Props = {
  page: number;
  pageCount: number;
  onPageChange: (p: number) => void;
  className?: string;
};

const PaginationArrows = ({ page, pageCount, onPageChange, className = "" }: Props) => {
  if (pageCount <= 1) return null;
  const pages = getPages(page, pageCount);

  return (
    <nav className={cn("flex gap-1 justify-center items-center w-full py-3", className)}>
      <button
        className="p-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-40"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Página anterior"
        type="button"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-gray-400">...</span>
        ) : (
          <button
            key={`page-${p}`}
            className={cn(
              "px-3 py-1 rounded font-bold transition-all",
              p === page ? "bg-gold text-white shadow" : "text-gray-700 hover:bg-gray-100"
            )}
            onClick={() => onPageChange(Number(p))}
            disabled={p === page}
            type="button"
          >
            {p}
          </button>
        )
      )}
      <button
        className="p-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-40"
        disabled={page === pageCount}
        onClick={() => onPageChange(page + 1)}
        aria-label="Próxima página"
        type="button"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </nav>
  );
};

export default PaginationArrows;
