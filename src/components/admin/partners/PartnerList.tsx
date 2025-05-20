
import React from "react";
import { Button } from "@/components/ui/button";

export type Partner = {
  id: string;
  name: string;
  description?: string;
  banner_image_url?: string;
  logo_url: string;
  link?: string;
  order_index: number;
  visible: boolean;
};

type PartnerListProps = {
  partners: Partner[];
  loading: boolean;
  onEdit: (partner: Partner) => void;
  onDelete: (id: string) => void;
  onMove: (index: number, delta: number) => void;
};

export default function PartnerList({
  partners,
  loading,
  onEdit,
  onDelete,
  onMove,
}: PartnerListProps) {
  if (partners.length === 0) {
    return <p className="text-muted-foreground">Nenhum parceiro cadastrado.</p>;
  }
  return (
    <ul>
      {partners.map((partner, idx) => (
        <li key={partner.id} className="border-b py-2 flex flex-col md:flex-row md:items-center gap-2">
          <div className="flex-1">
            <span className="font-semibold mr-2">{partner.name}</span>
            <span className="text-sm text-muted-foreground">{partner.description}</span>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onMove(idx, -1)} disabled={idx === 0 || loading}>↑</Button>
            <Button size="sm" variant="outline" onClick={() => onMove(idx, 1)} disabled={idx === partners.length - 1 || loading}>↓</Button>
            <Button size="sm" onClick={() => onEdit(partner)} disabled={loading}>Editar</Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete(partner.id)} disabled={loading}>Excluir</Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
