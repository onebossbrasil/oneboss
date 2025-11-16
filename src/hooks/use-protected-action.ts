import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useCallback } from "react";

/**
 * Hook para proteger ações que requerem autenticação
 *
 * @example
 * const protectedWhatsApp = useProtectedAction(() => {
 *   window.open(whatsappUrl, "_blank");
 * });
 *
 * <Button onClick={protectedWhatsApp}>Falar com Vendedor</Button>
 */
export const useProtectedAction = (action: () => void) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const executeProtectedAction = useCallback(() => {
    if (!user) {
      // Usuário não está logado, redireciona para login com returnUrl
      const returnUrl = location.pathname + location.search;
      navigate(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }

    // Usuário está logado, executa a ação
    action();
  }, [user, action, navigate, location]);

  return executeProtectedAction;
};
