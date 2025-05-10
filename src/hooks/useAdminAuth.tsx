import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export interface AdminAuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useAdminAuth() {
  // Since we're bypassing authentication, we'll set default values
  const [authState, setAuthState] = useState<AdminAuthState>({
    isAuthenticated: true, // Always authenticated
    isAdmin: true, // Always admin
    isLoading: false, // Never loading
    error: null
  });
  const { toast } = useToast();

  const handleLogin = async (success: boolean) => {
    if (success) {
      console.log("Login simulado bem-sucedido");
      setAuthState({
        isAuthenticated: true,
        isAdmin: true,
        isLoading: false,
        error: null
      });
    } else {
      console.log("Login simulado falhou");
      toast({
        title: "Erro de login",
        description: "Falha ao fazer login simulado.",
        variant: "destructive",
      });
      setAuthState({
        isAuthenticated: false,
        isAdmin: false,
        isLoading: false,
        error: "Falha ao fazer login simulado."
      });
    }
  };

  const handleLogout = async () => {
    try {
      console.log("Realizando logout simulado");
      toast({
        title: "Logout simulado",
        description: "Em um sistema real, você seria desconectado.",
      });
      // We're not changing the state since we want to keep users logged in
    } catch (error) {
      console.error("Erro ao simular logout:", error);
      toast({
        title: "Erro ao sair",
        description: "Ocorreu um erro ao simular logout.",
        variant: "destructive",
      });
    }
  };

  return {
    ...authState,
    handleLogin,
    handleLogout
  };
}
