
import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminLoading = () => {
  console.log("Renderizando componente AdminLoading");
  
  const handleForceAccess = () => {
    console.log("Forçando acesso ao painel administrativo");
    window.location.reload();
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin mb-4" />
      <p>Carregando...</p>
      <p className="text-sm text-muted-foreground mt-2">Verificando credenciais de administrador</p>
      
      <Button 
        onClick={handleForceAccess} 
        variant="outline"
        className="mt-6"
      >
        Forçar acesso ao painel
      </Button>
    </div>
  );
};

export default AdminLoading;
