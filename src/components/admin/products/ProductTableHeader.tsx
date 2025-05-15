
import React from "react";
import { TableHead, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface ProductTableHeaderProps {
  allSelected: boolean;
  onToggleAll: (checked: boolean) => void;
}

const ProductTableHeader = ({ allSelected, onToggleAll }: ProductTableHeaderProps) => (
  <TableRow>
    <TableHead className="w-10 text-center">
      <Checkbox
        checked={allSelected}
        onCheckedChange={onToggleAll}
        aria-label="Selecionar todos"
      />
    </TableHead>
    <TableHead className="w-12">Imagem</TableHead>
    <TableHead>Nome</TableHead>
    <TableHead>Preço</TableHead>
    <TableHead>Estoque</TableHead>
    <TableHead className="text-center">Publicado</TableHead>
    <TableHead className="text-right">Ações</TableHead>
  </TableRow>
);

export default ProductTableHeader;
