
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
      console.log("checkAdminPermissions: Email não definido");
      return false;
    }

    try {
      console.log("Verificando permissões de admin para email:", userEmail);
      
      const { data: adminData, error: adminError } = await supabase
        .from('admin_permissions')
        .select('role')
        .eq('email', userEmail)
        .single();
      
      console.log("Resultado da verificação de admin:", { adminData, adminError });
      
      if (adminError) {
        if (adminError.code === 'PGRST116') { // No rows found
          console.log("Usuário não é administrador:", userEmail);
          return false;
        } else {
          console.error("Erro ao verificar permissões de admin:", adminError);
          return false;
        }
      }
      
      console.log("Usuário é administrador:", userEmail, "Role:", adminData?.role);
      return !!adminData;
    } catch (error) {
      console.error("Exceção ao verificar permissões:", error);
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Iniciando verificação de autenticação...");
        const { data: { session } } = await supabase.auth.getSession();
        
        console.log("Sessão atual:", session ? `Usuário: ${session.user.email}` : "Nenhuma sessão");
        
        if (!session) {
          console.log("Nenhuma sessão encontrada, usuário não está autenticado");
          setAuthState({
            isAuthenticated: false,
            isAdmin: false,
            isLoading: false,
            error: null
          });
          return;
        }
        
        console.log("Usuário autenticado:", session.user.email);
        
        // Verificar permissões de admin se estiver autenticado
        const isAdmin = await checkAdminPermissions(session?.user?.email);
        
        console.log("Resultado final da verificação:", { 
          isAuthenticated: !!session, 
          isAdmin, 
          email: session?.user?.email 
        });
        
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
        console.log("Evento de autenticação sem sessão");
        setAuthState({
          isAuthenticated: false,
          isAdmin: false,
          isLoading: false,
          error: null
        });
        return;
      }
      
      const isAdmin = await checkAdminPermissions(session?.user?.email);
      console.log("Atualização de estado após evento de auth:", { 
        evento: event, 
        isAuthenticated: !!session, 
        isAdmin 
      });
      
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
      console.log("Login bem-sucedido, verificando sessão e permissões");
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Sessão após login:", session ? `Usuário: ${session.user.email}` : "Sem sessão");
      
      const isAdmin = await checkAdminPermissions(session?.user?.email);
      console.log("Verificação de admin após login:", { isAdmin, email: session?.user?.email });
      
      if (!isAdmin) {
        console.log("Usuário autenticado mas não é admin:", session?.user?.email);
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
      console.log("Login falhou");
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
      console.log("Realizando logout");
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
