
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface AdminLoginProps {
  onLogin: (success: boolean) => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Login automático - considera sempre que deu certo
    onLogin(true);
    toast({
      title: "Acesso direto ativado",
      description: "Você está sendo redirecionado ao painel administrativo.",
    });
    navigate("/admin");
  }, [onLogin, toast, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <p>Redirecionando para o painel administrativo...</p>
    </div>
  );
};

export default AdminLogin;
