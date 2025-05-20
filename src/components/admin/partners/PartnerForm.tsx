
import React from "react";
import { Button } from "@/components/ui/button";
import ImageInputSupabase from "./ImageInputSupabase";

type PartnerFormProps = {
  form: {
    name: string;
    description?: string;
    banner_image_url?: string;
    logo_url: string;
    link?: string;
  };
  editingId: string | null;
  loading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBannerChange: (url: string) => void;
  onLogoChange: (url: string) => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function PartnerForm({
  form,
  editingId,
  loading,
  onChange,
  onBannerChange,
  onLogoChange,
  onCancel,
  onSubmit,
}: PartnerFormProps) {
  return (
    <form className="space-y-3 mb-6" onSubmit={onSubmit}>
      <input
        name="name"
        placeholder="Nome do parceiro"
        value={form.name}
        onChange={onChange}
        required
        className="w-full border rounded px-3 py-2"
      />
      <textarea
        name="description"
        placeholder="Descrição breve (aparece no banner da home)"
        value={form.description}
        onChange={onChange}
        className="w-full border rounded px-3 py-2"
      />
      <ImageInputSupabase
        label="Banner do parceiro (recomendado 1200x400px)"
        bucket="partners-banners"
        value={form.banner_image_url || ""}
        onChange={onBannerChange}
        accept="image/png,image/jpeg,image/webp"
        disabled={loading}
      />
      <ImageInputSupabase
        label="Logo PNG sem fundo (para carrossel e banner)"
        bucket="partners-logos"
        value={form.logo_url || ""}
        onChange={onLogoChange}
        accept="image/png"
        disabled={loading}
      />
      <input
        name="link"
        placeholder="Link do parceiro (site, Instagram, etc)"
        value={form.link}
        onChange={onChange}
        className="w-full border rounded px-3 py-2"
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={loading}>
          {editingId ? "Salvar alterações" : "Adicionar"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onCancel}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
