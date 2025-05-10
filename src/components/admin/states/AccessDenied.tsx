
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface AccessDeniedProps {
  onLogout: () => void;
}

const AccessDenied = ({ onLogout }: AccessDeniedProps) => {
  useEffect(() => {
    console.log("Renderizando componente AccessDenied - usuário autenticado mas sem permissões de admin");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md w-full text-center">
        <h2 className="text-xl font-bold text-red-800 dark:text-red-300 mb-3">Acesso Negado</h2>
        <p className="text-red-700 dark:text-red-200 mb-4">
          Sua conta não possui permissões de administrador.
        </p>
        <p className="text-sm text-red-600 dark:text-red-400 mb-4">
          Para obter acesso administrativo, entre em contato com o administrador do sistema.
        </p>
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
      </div>
    </div>
  );
};

export default AccessDenied;
