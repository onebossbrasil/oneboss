
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
    <TableHead className="min-w-[260px] w-[30%]">Nome</TableHead>
    <TableHead>Preço</TableHead>
    <TableHead>Estoque</TableHead>
    {/* Removido o cabeçalho de Publicado */}
    <TableHead className="text-right">Ações</TableHead>
  </TableRow>
);

export default ProductTableHeader;
