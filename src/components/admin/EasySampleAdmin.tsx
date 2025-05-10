
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const EasySampleAdmin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const accessAdmin = async () => {
    try {
      setIsLoading(true);
      console.log("Acessando admin diretamente...");
      
      toast({
        title: "Acesso liberado!",
        description: "Redirecionando para o painel administrativo.",
      });
      
      navigate("/admin");
      
    } catch (error: any) {
      console.error("Erro ao acessar admin:", error);
      toast({
        title: "Erro ao acessar admin",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={accessAdmin} 
      disabled={isLoading}
      className="bg-gold hover:bg-gold/90 text-white"
    >
      {isLoading ? "Acessando..." : "Acesso ao Admin"}
    </Button>
  );
};

export default EasySampleAdmin;
