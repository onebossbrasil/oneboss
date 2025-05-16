
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Adapted to https://stackoverflow.com/a/51929524 for condensed pagination
function getPages(current: number, total: number) {
  let delta = 2, range = [], rangeWithDots = [], l: number;

  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i);
  }

  if (current - delta > 2) rangeWithDots.push("...");
  rangeWithDots = [...rangeWithDots, ...range];
  if (current + delta < total - 1) rangeWithDots.push("...");

  return [1, ...rangeWithDots, total].filter((v, i, a) => !a.includes(v, i + 1));
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
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={i} className="px-2 text-gray-400">...</span>
        ) : (
          <button
            key={p}
            className={cn(
              "px-3 py-1 rounded font-bold transition-all",
              p === page ? "bg-gold text-white shadow" : "text-gray-700 hover:bg-gray-100"
            )}
            onClick={() => onPageChange(Number(p))}
            disabled={p === page}
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
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </nav>
  );
};

export default PaginationArrows;
