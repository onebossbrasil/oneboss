
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface AdminErrorProps {
  errorMessage: string;
}

const AdminError = ({ errorMessage }: AdminErrorProps) => {
  useEffect(() => {
    console.log("Renderizando componente AdminError com mensagem:", errorMessage);
  }, [errorMessage]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md w-full text-center">
        <h2 className="text-xl font-bold text-red-800 dark:text-red-300 mb-3">Erro</h2>
        <p className="text-red-700 dark:text-red-200 mb-4">
          {errorMessage}
        </p>
        <pre className="text-xs text-red-600 dark:text-red-400 mb-4 text-left overflow-auto max-h-32 bg-red-50 dark:bg-red-900/40 p-2 rounded">
          Detalhes técnicos: {errorMessage}
        </pre>
        <Button 
          variant="outline" 
          onClick={() => {
            console.log("Tentando recarregar após erro");
            window.location.reload();
          }} 
          className="border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40"
        >
          Tentar novamente
        </Button>
      </div>
    </div>
  );
};

export default AdminError;
