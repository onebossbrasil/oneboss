
import PaginationArrows from "@/components/ui/PaginationArrows";

interface ProductListPaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (p: number) => void;
}

export default function ProductListPagination({
  page,
  pageCount,
  onPageChange,
}: ProductListPaginationProps) {
  return (
    <PaginationArrows
      page={page}
      pageCount={pageCount}
      onPageChange={onPageChange}
      className="my-8"
    />
  );
}
