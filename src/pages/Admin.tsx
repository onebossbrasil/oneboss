
import React, { useState, useEffect } from "react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import AdminError from "@/components/admin/states/AdminError";

const Admin = () => {
  const { toast } = useToast();
  const [dbConnectionError, setDbConnectionError] = useState<string | null>(null);
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);

  // Check database connection on mount
  useEffect(() => {
    checkDatabaseConnection();
  }, []);

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

  const handleLogout = () => {
    toast({
      title: "Logout simulado",
      description: "Em um sistema real, você seria desconectado."
    });
  };

  const handleRetryConnection = () => {
    setDbConnectionError(null);
    checkDatabaseConnection();
  };

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

  // Renderizar o painel administrativo se a conexão estiver OK
  return (
    <SidebarProvider>
      <AdminDashboard onLogout={handleLogout} />
    </SidebarProvider>
  );
};

export default Admin;
