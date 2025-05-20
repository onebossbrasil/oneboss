
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Partner } from "./PartnerList";

export type PartnerForm = Omit<Partner, "id" | "order_index" | "visible">;

const initialForm: PartnerForm = {
  name: "",
  description: "",
  banner_image_url: "",
  logo_url: "",
  link: "",
};

export function usePartnerManager() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [form, setForm] = useState<PartnerForm>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const { toast } = useToast();

  const fetchPartners = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .order("order_index", { ascending: true });
    if (!error && data) {
      setPartners(data);
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
  }, [toast]);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);
  };

  const handleSave = async (e: React.FormEvent) => {
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
        if (!data || data.length === 0)
          throw new Error("Nada foi alterado. Verifique se você tem permissão de admin.");
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
        if (!data || data.length === 0)
          throw new Error("Nada foi inserido. Você é admin?");
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
  };

  const handleEdit = (partner: Partner) => {
    setEditingId(partner.id);
    setShowForm(true);
    setForm({
      name: partner.name,
      description: partner.description || "",
      banner_image_url: partner.banner_image_url || "",
      logo_url: partner.logo_url,
      link: partner.link || "",
    });
  };

  const handleDelete = async (id: string) => {
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
  };

  const move = async (index: number, delta: number) => {
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
        if (error) throw error;
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
  };

  return {
    partners,
    form,
    editingId,
    showForm,
    loading,
    fetchError,
    setShowForm,
    setEditingId,
    setForm,
    handleInput,
    handleCancelForm,
    handleSave,
    handleEdit,
    handleDelete,
    move,
  };
}
