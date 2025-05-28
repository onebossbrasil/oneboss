
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { SidebarHeader } from "@/components/ui/sidebar";

interface FilterSidebarHeaderProps {
  isMobile: boolean;
  onClose: () => void;
  onResetFilters: () => void;
}

const FilterSidebarHeader = ({
  isMobile,
  onClose,
  onResetFilters,
}: FilterSidebarHeaderProps) => {
  return (
    <SidebarHeader className="mb-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">Filtros</h2>
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={onClose}
          >
            <X size={18} />
          </Button>
        )}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="mt-4 text-xs w-full border-gold/40 text-gold hover:bg-gold/10 hover:text-gold"
        onClick={onResetFilters}
      >
        Limpar Filtros
      </Button>
    </SidebarHeader>
  );
};

export default FilterSidebarHeader;
