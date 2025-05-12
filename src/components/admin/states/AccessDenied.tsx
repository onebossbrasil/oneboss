
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
  const [isChecking, setIsChecking] = useState(false);
  
  useEffect(() => {
    console.log("Renderizando componente AccessDenied - usuário autenticado mas sem permissões de admin");
    console.log("Email do usuário:", user?.email);
    
    // Verificar status do email nas permissões de admin para debug
    const checkEmailInPermissions = async () => {
      if (!user?.email) return;
      
      setIsChecking(true);
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
          
          // Verificar se o email existe na tabela admin_permissions
          const { data: adminData, error: adminError } = await supabase
            .from('admin_permissions')
            .select('email')
            .eq('email', data)
            .single();
            
          if (adminError) {
            if (adminError.code === 'PGRST116') {
              setDebugInfo(`Email "${data}" NÃO encontrado na tabela admin_permissions.`);
            } else {
              setDebugInfo(`Erro ao verificar permissões: ${adminError.message}`);
            }
          } else if (adminData) {
            setDebugInfo(`Email "${data}" encontrado na tabela admin_permissions mas a função is_current_user_admin() retornou falso. Tente limpar o cache e recarregar.`);
          }
        } else {
          setDebugInfo("Email não foi detectado pelo sistema.");
        }
        
      } catch (err) {
        console.error("Erro ao verificar permissões:", err);
      } finally {
        setIsChecking(false);
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md w-full text-center shadow-md">
        <h2 className="text-xl font-bold text-red-800 dark:text-red-300 mb-3">Acesso Negado</h2>
        <p className="text-red-700 dark:text-red-200 mb-4">
          Sua conta ({user?.email || 'não identificada'}) não possui permissões de administrador.
        </p>
        
        {isChecking ? (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600 mr-2"></div>
            <span className="text-sm text-red-600">Verificando permissões...</span>
          </div>
        ) : debugInfo && (
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
