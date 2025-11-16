import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsNativeApp } from "@/hooks/use-platform";

/**
 * Componente que gerencia o ciclo de vida do app
 *
 * Comportamento ATUALIZADO:
 * - Web: Navegação livre, login apenas quando necessário
 * - App Nativo: IGUAL AO WEB - navegação livre, login apenas quando necessário
 *
 * REMOVIDO: Redirecionamento forçado para login ao abrir o app
 * MOTIVO: Usuário deve poder navegar livremente, igual no computador
 */
export const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  // Componente desabilitado - navegação livre no app
  // Login será solicitado apenas quando necessário (ex: mandar mensagem)
  return <>{children}</>;
};
