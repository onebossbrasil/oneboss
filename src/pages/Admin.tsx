
import React, { useState, useEffect } from "react";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Verificar se o usuário está autenticado com Supabase
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }
      
      setIsAuthenticated(!!session);
      
      // Verificar se o usuário tem permissões de administrador
      if (session?.user) {
        const { data: adminData } = await supabase
          .from('admin_permissions')
          .select('*')
          .eq('email', session.user.email)
          .single();
          
        setIsAdmin(!!adminData);
      }
      
      setIsLoading(false);
    };

    checkAuth();

    // Configurar listener para alterações no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsAuthenticated(!!session);
      
      if (session?.user) {
        const { data: adminData } = await supabase
          .from('admin_permissions')
          .select('*')
          .eq('email', session.user.email)
          .single();
          
        setIsAdmin(!!adminData);
      } else {
        setIsAdmin(false);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (success: boolean) => {
    if (success) {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: adminData } = await supabase
          .from('admin_permissions')
          .select('*')
          .eq('email', session.user.email)
          .single();
          
        setIsAdmin(!!adminData);
      }
    }
    
    setIsAuthenticated(success);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Carregando...</p>
      </div>
    );
  }

  // Se não estiver autenticado, mostrar tela de login
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  // Se estiver autenticado, mas não for admin, mostrar mensagem de acesso negado
  if (!isAdmin) {
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
  return <AdminDashboard onLogout={handleLogout} />;
};

export default Admin;
