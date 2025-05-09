
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  productId: string | null;
  status: string;
  createdAt: string;
};

type LeadContextType = {
  leads: Lead[];
  isLoading: boolean;
  error: string | null;
  addLead: (lead: Omit<Lead, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  updateLeadStatus: (id: string, status: string) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  refreshLeads: () => Promise<void>;
};

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export const LeadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (leadsError) throw leadsError;

      const formattedLeads: Lead[] = data.map((lead: any) => ({
        id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        message: lead.message,
        productId: lead.product_id,
        status: lead.status || 'new',
        createdAt: lead.created_at,
      }));

      setLeads(formattedLeads);
    } catch (err: any) {
      console.error('Error fetching leads:', err);
      setError(err.message);
      toast({
        title: 'Erro ao carregar leads',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addLead = async (lead: Omit<Lead, 'id' | 'status' | 'createdAt'>) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('leads')
        .insert({
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          message: lead.message,
          product_id: lead.productId,
        });
        
      if (error) throw error;
      
      // Only refresh leads if we're in admin mode
      // Regular users don't need to see all leads
      if (window.location.pathname.includes('/admin')) {
        await fetchLeads();
      }
      
      toast({
        title: 'Mensagem enviada',
        description: 'Recebemos sua mensagem e entraremos em contato em breve.',
      });
    } catch (err: any) {
      console.error('Error adding lead:', err);
      toast({
        title: 'Erro ao enviar mensagem',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateLeadStatus = async (id: string, status: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', id);
        
      if (error) throw error;
      
      await fetchLeads();
      
      toast({
        title: 'Status atualizado',
        description: 'O status do lead foi atualizado com sucesso.',
      });
    } catch (err: any) {
      console.error('Error updating lead status:', err);
      toast({
        title: 'Erro ao atualizar status',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLead = async (id: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      await fetchLeads();
      
      toast({
        title: 'Lead removido',
        description: 'O lead foi removido com sucesso.',
      });
    } catch (err: any) {
      console.error('Error deleting lead:', err);
      toast({
        title: 'Erro ao remover lead',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshLeads = () => fetchLeads();

  return (
    <LeadContext.Provider value={{
      leads,
      isLoading,
      error,
      addLead,
      updateLeadStatus,
      deleteLead,
      refreshLeads
    }}>
      {children}
    </LeadContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadContext);
  if (context === undefined) {
    throw new Error("useLeads must be used within a LeadProvider");
  }
  return context;
};
