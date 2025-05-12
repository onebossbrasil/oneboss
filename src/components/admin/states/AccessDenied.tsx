
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, RefreshCcw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface AccessDeniedProps {
  onLogout: () => void;
}

const AccessDenied = ({ onLogout }: AccessDeniedProps) => {
  const { user } = useAuth();
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  
  useEffect(() => {
    console.log("Renderizando componente AccessDenied - usuário autenticado mas sem permissões de admin");
    console.log("Email do usuário:", user?.email);
    
    // Verificar status do email nas permissões de admin para debug
    const checkEmailInPermissions = async () => {
      if (!user?.email) return;
      
      try {
        // Verificar se o email existe na tabela de permissões
        const { data, error } = await supabase.rpc('get_current_user_email');
        
        if (error) {
          console.error("Erro ao verificar email via RPC:", error);
          setDebugInfo(`Erro ao verificar permissões: ${error.message}`);
          return;
        }
        
        if (data) {
          console.log("Email detectado pela função RPC:", data);
          setDebugInfo(`Email identificado pelo sistema: ${data}`);
        } else {
          setDebugInfo("Email não foi detectado pelo sistema.");
        }
        
      } catch (err) {
        console.error("Erro ao verificar permissões:", err);
      }
    };
    
    checkEmailInPermissions();
  }, [user]);

  const handleClearSessionAndReload = () => {
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.clear();
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md w-full text-center">
        <h2 className="text-xl font-bold text-red-800 dark:text-red-300 mb-3">Acesso Negado</h2>
        <p className="text-red-700 dark:text-red-200 mb-4">
          Sua conta ({user?.email || 'não identificada'}) não possui permissões de administrador.
        </p>
        
        {debugInfo && (
          <div className="text-sm bg-red-100 dark:bg-red-900/40 p-3 rounded mb-4">
            <p className="font-semibold">Informações para diagnóstico:</p>
            <p className="text-red-600 dark:text-red-400">{debugInfo}</p>
          </div>
        )}
        
        <p className="text-sm text-red-600 dark:text-red-400 mb-4">
          Para obter acesso administrativo, entre em contato com o administrador do sistema.
        </p>
        
        <div className="flex flex-col gap-3">
          <Button 
            variant="outline" 
            onClick={() => {
              console.log("Realizando logout de usuário sem permissões de admin");
              onLogout();
            }} 
            className="border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
          
          <Button
            variant="ghost"
            onClick={handleClearSessionAndReload}
            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Limpar cache e recarregar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
