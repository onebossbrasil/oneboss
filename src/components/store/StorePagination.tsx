
import React from "react";
import { Button } from "@/components/ui/button";

interface StorePaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const StorePagination = ({ currentPage, totalPages, setCurrentPage }: StorePaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8">
      <nav className="flex justify-center">
        {Array.from({ length: totalPages }, (_, idx) => (
          <Button
            key={idx}
            size="sm"
            variant={currentPage === idx + 1 ? "default" : "outline"}
            className={`mx-1 ${currentPage === idx + 1 ? "font-bold" : ""}`}
            onClick={() => setCurrentPage(idx + 1)}
            disabled={currentPage === idx + 1}
          >
            {idx + 1}
          </Button>
        ))}
      </nav>
    </div>
  );
};

export default StorePagination;
