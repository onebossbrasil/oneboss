
import React, { useState, useEffect } from "react";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Verificar se o usuário está autenticado com Supabase
    const checkAuth = async () => {
      try {
        console.log("Verificando autenticação...");
        // Recuperar a sessão atual
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("Nenhuma sessão encontrada");
          setIsAuthenticated(false);
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }
        
        console.log("Sessão encontrada para:", session.user.email);
        setIsAuthenticated(!!session);
        
        // Verificar se o usuário tem permissões de administrador diretamente
        if (session?.user?.email) {
          try {
            const { data: adminData, error: adminError } = await supabase
              .from('admin_permissions')
              .select('role')
              .eq('email', session.user.email)
              .single();
            
            console.log("Verificação direta de permissões admin:", { adminData, adminError });
            
            if (adminError) {
              if (adminError.code === 'PGRST116') { // No rows found
                console.log("Usuário não é administrador");
                setIsAdmin(false);
              } else {
                console.error("Erro ao verificar permissões de admin:", adminError);
                setError("Erro ao verificar permissões. Por favor, tente novamente.");
                setIsAdmin(false);
              }
            } else {
              console.log("Usuário é administrador com papel:", adminData?.role);
              setIsAdmin(!!adminData);
            }
          } catch (checkError) {
            console.error("Exceção ao verificar permissões:", checkError);
            setError("Erro ao verificar permissões. Por favor, tente novamente.");
            setIsAdmin(false);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        setError("Erro ao verificar autenticação. Por favor, tente novamente.");
        setIsLoading(false);
      }
    };

    checkAuth();

    // Configurar listener para alterações no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      setIsAuthenticated(!!session);
      
      if (session?.user?.email) {
        try {
          const { data: adminData, error: adminError } = await supabase
            .from('admin_permissions')
            .select('role')
            .eq('email', session.user.email)
            .single();
          
          if (adminError) {
            if (adminError.code === 'PGRST116') { // No rows found
              console.log("Usuário não é administrador");
              setIsAdmin(false);
            } else {
              console.error("Erro ao verificar permissões de admin no event listener:", adminError);
              setIsAdmin(false);
            }
          } else {
            console.log("Usuário é administrador com papel:", adminData?.role);
            setIsAdmin(!!adminData);
          }
        } catch (error) {
          console.error("Erro ao verificar permissões no event listener:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.email) {
        try {
          console.log("Verificando permissões após login para:", session.user.email);
          const { data: adminData, error: adminError } = await supabase
            .from('admin_permissions')
            .select('*')
            .eq('email', session.user.email)
            .single();
            
          console.log("Resultado da verificação de admin após login:", { adminData, adminError });
            
          if (adminError) {
            console.error("Erro ao verificar permissões de admin após login:", adminError);
            toast({
              title: "Erro de permissão",
              description: "Não foi possível verificar suas permissões de administrador.",
              variant: "destructive",
            });
            setIsAdmin(false);
          } else {
            console.log("Definindo isAdmin como true");
            setIsAdmin(!!adminData);
          }
        } catch (error) {
          console.error("Erro ao verificar permissões após login:", error);
          setIsAdmin(false);
        }
      }
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setIsAdmin(false);
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-red-800 dark:text-red-300 mb-3">Erro</h2>
          <p className="text-red-700 dark:text-red-200 mb-4">
            {error}
          </p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()} 
            className="border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40"
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, mostrar tela de login
  if (!isAuthenticated) {
    console.log("Mostrando tela de login, não autenticado");
    return <AdminLogin onLogin={handleLogin} />;
  }

  // Se estiver autenticado, mas não for admin, mostrar mensagem de acesso negado
  if (!isAdmin) {
    console.log("Mostrando tela de acesso negado, não é admin");
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-red-800 dark:text-red-300 mb-3">Acesso Negado</h2>
          <p className="text-red-700 dark:text-red-200 mb-4">
            Sua conta não possui permissões de administrador.
          </p>
          <Button 
            variant="outline" 
            onClick={handleLogout} 
            className="border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    );
  }

  // Se estiver autenticado e for admin, mostrar painel de administração
  console.log("Mostrando painel de administração");
  return <AdminDashboard onLogout={handleLogout} />;
};

export default Admin;
