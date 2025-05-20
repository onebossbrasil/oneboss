
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import ImageInputSupabase from "./ImageInputSupabase";
import { useToast } from "@/hooks/use-toast";
import PartnerForm from "./PartnerForm";
import PartnerList, { Partner } from "./PartnerList";

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
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { toast } = useToast();

  // Busca lista de parceiros em tempo real, sem demos
  const fetchPartners = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .order("order_index", { ascending: true });
    if (!error && data) {
      setPartners(data); // Garante sincronização exata
      setFetchError(null);
    } else {
      setPartners([]);
      setFetchError(error?.message || "Erro desconhecido");
      toast({
        title: "Erro ao buscar parceiros",
        description: error?.message || "Erro desconhecido ao buscar parceiros",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleCancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (!form.name || !form.logo_url) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e logo são obrigatórios.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    try {
      if (editingId) {
        const { error, data } = await supabase.from("partners").update({
          ...form,
        }).eq("id", editingId).select();
        if (error) throw error;
        if (!data || data.length === 0) {
          throw new Error("Nada foi alterado. Verifique se você tem permissão de admin.");
        }
        toast({
          title: "Parceiro atualizado",
          description: "As alterações foram salvas com sucesso!",
          variant: "default",
        });
      } else {
        const maxOrder = Math.max(0, ...partners.map((p) => p.order_index ?? 0));
        const { error, data } = await supabase.from("partners").insert({
          ...form,
          order_index: maxOrder + 1,
          visible: true,
        }).select();
        if (error) throw error;
        if (!data || data.length === 0) {
          throw new Error("Nada foi inserido. Você é admin?");
        }
        toast({
          title: "Parceiro cadastrado",
          description: "O parceiro foi cadastrado com sucesso!",
          variant: "default",
        });
      }
      await fetchPartners();
      setShowForm(false);
      setEditingId(null);
      setForm(initialForm);
    } catch (error: any) {
      toast({
        title: "Erro ao salvar parceiro",
        description: error?.message || "Erro desconhecido ao salvar parceiro.",
        variant: "destructive",
      });
    }
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
    try {
      const { error, data } = await supabase.from("partners").delete().eq("id", id).select();
      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error("Nada foi excluído. Talvez você não seja admin ou já foi removido.");
      }
      toast({
        title: "Parceiro excluído",
        description: "O parceiro foi excluído com sucesso!",
        variant: "default",
      });
      await fetchPartners();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir parceiro",
        description: error?.message || "Erro ao excluir parceiro",
        variant: "destructive",
      });
    }
    setLoading(false);
  }

  async function move(index: number, delta: number) {
    if (
      (index === 0 && delta < 0) ||
      (index === partners.length - 1 && delta > 0)
    )
      return;
    setLoading(true);
    const newPartners = [...partners];
    const [removed] = newPartners.splice(index, 1);
    newPartners.splice(index + delta, 0, removed);
    try {
      for (let i = 0; i < newPartners.length; i++) {
        newPartners[i].order_index = i;
        const { error } = await supabase
          .from("partners")
          .update({ order_index: i })
          .eq("id", newPartners[i].id);
        if (error) {
          throw error;
        }
      }
      await fetchPartners();
    } catch (error: any) {
      toast({
        title: "Erro ao reordenar parceiros",
        description: error?.message || "Erro desconhecido ao reordenar parceiros.",
        variant: "destructive",
      });
    }
    setLoading(false);
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
        }} className="bg-gold hover:bg-gold/80 text-white">Novo Parceiro</Button>
      </div>
      {fetchError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          Erro ao buscar parceiros: {fetchError}
        </div>
      )}
      {showForm && (
        <PartnerForm
          form={form}
          editingId={editingId}
          loading={loading}
          onChange={handleInput}
          onBannerChange={url => setForm(f => ({ ...f, banner_image_url: url }))}
          onLogoChange={url => setForm(f => ({ ...f, logo_url: url }))}
          onCancel={handleCancelForm}
          onSubmit={handleSave}
        />
      )}
      <div>
        <PartnerList
          partners={partners}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onMove={move}
        />
      </div>
    </div>
  );
}
