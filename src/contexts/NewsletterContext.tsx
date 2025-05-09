
import React, { createContext, useContext, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type NewsletterSubscriber = {
  id: string;
  email: string;
  subscribedAt: string;
};

type NewsletterContextType = {
  isLoading: boolean;
  error: string | null;
  subscribe: (email: string) => Promise<boolean>;
};

const NewsletterContext = createContext<NewsletterContextType | undefined>(undefined);

export const NewsletterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribe = async (email: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email });
        
      if (error) {
        if (error.code === '23505') { // Unique violation error code
          toast({
            title: 'Email já cadastrado',
            description: 'Este email já está inscrito em nossa newsletter.',
          });
          return true; // Consider it a success since they're already subscribed
        }
        throw error;
      }
      
      toast({
        title: 'Inscrição realizada',
        description: 'Obrigado por inscrever-se em nossa newsletter!',
      });
      
      return true;
    } catch (err: any) {
      console.error('Error subscribing to newsletter:', err);
      setError(err.message);
      toast({
        title: 'Erro ao inscrever-se',
        description: err.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NewsletterContext.Provider value={{
      isLoading,
      error,
      subscribe
    }}>
      {children}
    </NewsletterContext.Provider>
  );
};

export const useNewsletter = () => {
  const context = useContext(NewsletterContext);
  if (context === undefined) {
    throw new Error("useNewsletter must be used within a NewsletterProvider");
  }
  return context;
};
