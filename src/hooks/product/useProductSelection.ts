
import { useState, useCallback } from "react";

export function useProductSelection(ids: string[]) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const isSelected = useCallback(
    (id: string) => selectedIds.includes(id),
    [selectedIds]
  );

  const toggleSelect = useCallback(
    (id: string) => {
      setSelectedIds((sel) => sel.includes(id) ? sel.filter(x => x !== id) : [...sel, id]);
    },
    []
  );

  const toggleSelectAll = useCallback(
    (checked: boolean | "indeterminate") => {
      if (checked) {
        setSelectedIds(ids);
      } else {
        setSelectedIds([]);
      }
    },
    [ids]
  );

  const isAllSelected = ids.length > 0 && selectedIds.length === ids.length;

  const clearSelection = useCallback(() => setSelectedIds([]), []);

  return {
    selectedIds,
    isSelected,
    toggleSelect,
    toggleSelectAll,
    isAllSelected,
    clearSelection,
  };
}
