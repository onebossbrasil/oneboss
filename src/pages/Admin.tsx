
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminLogin from "@/components/admin/AdminLogin";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import AdminError from "@/components/admin/states/AdminError";
import { useAuth } from "@/contexts/AuthContext";

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { session, user, isLoading: authLoading, signOut } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dbConnectionError, setDbConnectionError] = useState<string | null>(null);
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);

  // Check if user is authenticated
  useEffect(() => {
    if (!authLoading) {
      if (user && session) {
        setIsAuthenticated(true);
        checkDatabaseConnection();
      } else {
        setIsAuthenticated(false);
      }
    }
  }, [user, session, authLoading]);

  const checkDatabaseConnection = async () => {
    setIsCheckingConnection(true);
    try {
      // Simple query to check connection
      const { error } = await supabase.from('products').select('id').limit(1);
      
      if (error) {
        console.error('Database connection error:', error);
        setDbConnectionError(error.message);
      } else {
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
    } else {
      setIsAuthenticated(false);
    }
  };

  const handleRetryConnection = () => {
    setDbConnectionError(null);
    checkDatabaseConnection();
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
      <AdminError 
        errorMessage={`Erro ao conectar ao banco de dados: ${dbConnectionError}`} 
      />
    );
  }

  // Renderizar o painel administrativo se a conexão estiver OK e autenticado
  return (
    <SidebarProvider>
      <AdminDashboard onLogout={handleLogout} />
    </SidebarProvider>
  );
};

export default Admin;
