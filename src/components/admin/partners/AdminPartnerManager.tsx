import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import ImageInputSupabase from "./ImageInputSupabase";

type Partner = {
  id: string;
  name: string;
  description?: string;
  banner_image_url?: string;
  logo_url: string;
  link?: string;
  order_index: number;
  visible: boolean;
};

const initialForm: Omit<Partner, "id" | "order_index" | "visible"> = {
  name: "",
  description: "",
  banner_image_url: "",
  logo_url: "",
  link: "",
};

export default function AdminPartnerManager() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Carregar parceiros do banco
  const fetchPartners = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .order("order_index", { ascending: true });
    if (!error && data) setPartners(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  // Migrar demo se necessário
  useEffect(() => {
    // Se não há parceiros, insere parceiros demo
    if (partners.length === 0 && !loading) {
      (async () => {
        const demo = [
          {
            name: "EUROFIX",
            description: "Oficina mecânica especializada, preparação e performance",
            banner_image_url: "/lovable-uploads/94c4f913-0185-4aaa-b639-fa0e29e727ac.png",
            logo_url: "/lovable-uploads/1048c280-9081-420f-a0a1-899e5e5ce851.png",
            alt: "EUROFIX - Manutenção & Performance",
            link: null,
            order_index: 0,
            visible: true,
          },
          {
            name: "AUTOMATIZE",
            description: "",
            banner_image_url: "",
            logo_url: "/lovable-uploads/5bff8c7e-d3d1-45b9-8a6a-1fe67277ee72.png",
            alt: "AUTOMATIZE",
            link: null,
            order_index: 1,
            visible: true,
          },
        ];
        for (const partner of demo) {
          await supabase.from("partners").insert(partner);
        }
        fetchPartners();
      })();
    }
    // eslint-disable-next-line
  }, [partners, loading]);

  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (!form.name || !form.logo_url) {
      alert("Nome e logo são obrigatórios.");
      setLoading(false);
      return;
    }
    if (editingId) {
      await supabase.from("partners").update({
        ...form,
      }).eq("id", editingId);
    } else {
      const maxOrder = Math.max(0, ...partners.map((p) => p.order_index ?? 0));
      await supabase.from("partners").insert({
        ...form,
        order_index: maxOrder + 1,
        visible: true,
      });
    }
    fetchPartners();
    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);
    setLoading(false);
  }

  function handleEdit(partner: Partner) {
    setEditingId(partner.id);
    setShowForm(true);
    setForm({
      name: partner.name,
      description: partner.description || "",
      banner_image_url: partner.banner_image_url || "",
      logo_url: partner.logo_url,
      link: partner.link || "",
    });
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Tem certeza que deseja excluir este parceiro?")) return;
    setLoading(true);
    await supabase.from("partners").delete().eq("id", id);
    fetchPartners();
    setLoading(false);
  }

  // Reordenar parceiros
  async function move(index: number, delta: number) {
    if (
      (index === 0 && delta < 0) ||
      (index === partners.length - 1 && delta > 0)
    )
      return;
    const newPartners = [...partners];
    const [removed] = newPartners.splice(index, 1);
    newPartners.splice(index + delta, 0, removed);
    // Ajusta order_index
    for (let i = 0; i < newPartners.length; i++) {
      newPartners[i].order_index = i;
      await supabase
        .from("partners")
        .update({ order_index: i })
        .eq("id", newPartners[i].id);
    }
    fetchPartners();
  }

  return (
    <div className="bg-white rounded shadow-md py-5 px-6 max-w-2xl mx-auto my-8">
      <h2 className="font-bold font-playfair text-2xl mb-6 text-gold">
        Gerenciar Parceiros
      </h2>
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={() => {
          setShowForm(true);
          setEditingId(null);
          setForm(initialForm);
        }}>Novo Parceiro</Button>
      </div>
      {showForm && (
        <form className="space-y-3 mb-6" onSubmit={handleSave}>
          <input
            name="name"
            placeholder="Nome do parceiro"
            value={form.name}
            onChange={handleInput}
            required
            className="w-full border rounded px-3 py-2"
          />
          <textarea
            name="description"
            placeholder="Descrição breve (aparece no banner da home)"
            value={form.description}
            onChange={handleInput}
            className="w-full border rounded px-3 py-2"
          />
          <ImageInputSupabase
            label="Banner do parceiro (recomendado 1200x400px)"
            bucket="partners-banners"
            value={form.banner_image_url || ""}
            onChange={url => setForm(f => ({ ...f, banner_image_url: url }))}
            accept="image/png,image/jpeg,image/webp"
            disabled={loading}
          />
          <ImageInputSupabase
            label="Logo PNG sem fundo (para carrossel e banner)"
            bucket="partners-logos"
            value={form.logo_url || ""}
            onChange={url => setForm(f => ({ ...f, logo_url: url }))}
            accept="image/png"
            disabled={loading}
          />
          <input
            name="link"
            placeholder="Link do parceiro (site, Instagram, etc)"
            value={form.link}
            onChange={handleInput}
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
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setForm(initialForm);
              }}
            >
              Cancelar
            </Button>
          </div>
        </form>
      )}
      <div>
        {partners.length === 0 && <p className="text-muted-foreground">Nenhum parceiro cadastrado.</p>}
        <ul>
          {partners.map((partner, idx) => (
            <li key={partner.id} className="border-b py-2 flex flex-col md:flex-row md:items-center gap-2">
              <div className="flex-1">
                <span className="font-semibold mr-2">{partner.name}</span>
                <span className="text-sm text-muted-foreground">{partner.description}</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => move(idx, -1)} disabled={idx === 0}>↑</Button>
                <Button size="sm" variant="outline" onClick={() => move(idx, 1)} disabled={idx === partners.length - 1}>↓</Button>
                <Button size="sm" onClick={() => handleEdit(partner)}>Editar</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(partner.id)}>Excluir</Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
