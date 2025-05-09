
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface AdminAuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useAdminAuth() {
  const [authState, setAuthState] = useState<AdminAuthState>({
    isAuthenticated: false,
    isAdmin: false,
    isLoading: true,
    error: null
  });
  const { toast } = useToast();

  const checkAdminPermissions = async (userEmail: string | undefined) => {
    if (!userEmail) {
      return false;
    }

    try {
      const { data: adminData, error: adminError } = await supabase
        .from('admin_permissions')
        .select('role')
        .eq('email', userEmail)
        .single();
      
      console.log("Verificação de permissões admin:", { adminData, adminError });
      
      if (adminError) {
        if (adminError.code === 'PGRST116') { // No rows found
          console.log("Usuário não é administrador");
          return false;
        } else {
          console.error("Erro ao verificar permissões de admin:", adminError);
          return false;
        }
      }
      
      return !!adminData;
    } catch (error) {
      console.error("Exceção ao verificar permissões:", error);
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Verificando autenticação...");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("Nenhuma sessão encontrada");
          setAuthState({
            isAuthenticated: false,
            isAdmin: false,
            isLoading: false,
            error: null
          });
          return;
        }
        
        console.log("Sessão encontrada para:", session.user.email);
        
        // Verificar permissões de admin se estiver autenticado
        const isAdmin = await checkAdminPermissions(session?.user?.email);
        
        setAuthState({
          isAuthenticated: !!session,
          isAdmin,
          isLoading: false,
          error: null
        });
      } catch (error: any) {
        console.error("Erro ao verificar autenticação:", error);
        setAuthState({
          isAuthenticated: false,
          isAdmin: false,
          isLoading: false,
          error: "Erro ao verificar autenticação. Por favor, tente novamente."
        });
      }
    };

    checkAuth();

    // Configurar listener para alterações no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      
      if (!session) {
        setAuthState({
          isAuthenticated: false,
          isAdmin: false,
          isLoading: false,
          error: null
        });
        return;
      }
      
      const isAdmin = await checkAdminPermissions(session?.user?.email);
      
      setAuthState({
        isAuthenticated: !!session,
        isAdmin,
        isLoading: false,
        error: null
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (success: boolean) => {
    if (success) {
      const { data: { session } } = await supabase.auth.getSession();
      const isAdmin = await checkAdminPermissions(session?.user?.email);
      
      if (!isAdmin) {
        toast({
          title: "Erro de permissão",
          description: "Sua conta não tem permissões de administrador.",
          variant: "destructive",
        });
      }
      
      setAuthState({
        isAuthenticated: true,
        isAdmin,
        isLoading: false,
        error: null
      });
    } else {
      setAuthState({
        isAuthenticated: false,
        isAdmin: false,
        isLoading: false,
        error: null
      });
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setAuthState({
        isAuthenticated: false,
        isAdmin: false,
        isLoading: false,
        error: null
      });
      toast({
        title: "Logout realizado com sucesso",
        description: "Você saiu da área administrativa.",
      });
    } catch (error) {
      console.error("Erro ao realizar logout:", error);
      toast({
        title: "Erro ao sair",
        description: "Não foi possível realizar o logout. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return {
    ...authState,
    handleLogin,
    handleLogout
  };
}
