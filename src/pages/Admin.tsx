
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminLogin from "@/components/admin/AdminLogin";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import AdminError from "@/components/admin/states/AdminError";
import AccessDenied from "@/components/admin/states/AccessDenied";
import { useAuth } from "@/contexts/AuthContext";
import { RefreshCcw } from "lucide-react";

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { session, user, isLoading: authLoading, isAdmin, signOut } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dbConnectionError, setDbConnectionError] = useState<string | null>(null);
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);

  // Check if user is authenticated - optimization to prevent extra renders
  useEffect(() => {
    if (!authLoading) {
      const authenticated = !!user && !!session;
      console.log("Auth status in Admin:", authenticated ? "logged in" : "not logged in", user?.email);
      console.log("Admin status:", isAdmin ? "é admin" : "não é admin");
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        checkDatabaseConnection();
      } else {
        setIsCheckingConnection(false);
      }
    }
  }, [user, session, authLoading, isAdmin]);

  const checkDatabaseConnection = async () => {
    setIsCheckingConnection(true);
    try {
      console.log("Checking database connection with token:", !!session?.access_token);
      // Simple query to check connection
      const { error } = await supabase.from('products').select('id').limit(1);
      
      if (error) {
        console.error('Database connection error:', error);
        setDbConnectionError(error.message);
      } else {
        console.log("Database connection successful");
        setDbConnectionError(null);
      }
    } catch (err: any) {
      console.error('Fatal error checking database connection:', err);
      setDbConnectionError(err.message || 'Erro desconhecido de conexão');
    } finally {
      setIsCheckingConnection(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Você saiu do painel administrativo.",
      });
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Erro ao fazer logout",
        description: "Ocorreu um erro ao sair do sistema.",
        variant: "destructive",
      });
    }
  };

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
      checkDatabaseConnection();
    } else {
      setIsAuthenticated(false);
    }
  };

  const handleRetryConnection = () => {
    setDbConnectionError(null);
    checkDatabaseConnection();
  };

  const handleForceRefresh = () => {
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.clear();
    window.location.reload();
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show login
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  // Se autenticado mas não é admin, mostrar AccessDenied
  if (isAuthenticated && !isAdmin) {
    return (
      <div>
        <AccessDenied onLogout={handleLogout} />
        <div className="fixed bottom-4 right-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleForceRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Limpar cache e recarregar
          </Button>
        </div>
      </div>
    );
  }

  // Show loading state while checking connection
  if (isCheckingConnection) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Conectando ao banco de dados...</p>
        </div>
      </div>
    );
  }

  // Show error state if database connection fails
  if (dbConnectionError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">Erro de conexão</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {`Erro ao conectar ao banco de dados: ${dbConnectionError}`}
          </p>
          
          <div className="flex justify-between items-center">
            <Button onClick={handleRetryConnection}>Tentar novamente</Button>
            <Button variant="outline" onClick={handleLogout}>Sair</Button>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar o painel administrativo se a conexão estiver OK e autenticado
  return <AdminDashboard onLogout={handleLogout} />;
};

export default Admin;
