import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsNativeApp } from "@/hooks/use-platform";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean; // Se true, requer autenticação
}

/**
 * AuthGuard - Componente para proteger rotas
 *
 * Comportamento:
 * - Web: Permite navegação livre, redireciona para login apenas quando necessário
 * - App Nativo: Requer autenticação para TODAS as páginas (exceto login)
 */
const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = false,
}) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isNativeApp = useIsNativeApp();

  useEffect(() => {
    // Aguarda verificação de autenticação
    if (loading) return;

    const currentPath = location.pathname;
    const isLoginPage = currentPath === "/login";

    // Se está na página de login e já está autenticado, redireciona
    if (isLoginPage && user) {
      const redirectTo = new URLSearchParams(location.search).get("redirect_to") || "/";
      navigate(redirectTo, { replace: true });
      return;
    }

    // APP NATIVO: Requer login em TODAS as páginas (exceto /login)
    if (isNativeApp && !user && !isLoginPage) {
      console.log("[AuthGuard] App nativo sem autenticação, redirecionando para login");
      navigate(`/login?redirect_to=${encodeURIComponent(currentPath)}`, {
        replace: true,
      });
      return;
    }

    // WEB: Apenas requer login se requireAuth = true
    if (!isNativeApp && requireAuth && !user && !isLoginPage) {
      console.log("[AuthGuard] Rota protegida, redirecionando para login");
      navigate(`/login?redirect_to=${encodeURIComponent(currentPath)}`, {
        replace: true,
      });
      return;
    }
  }, [user, loading, navigate, location, isNativeApp, requireAuth]);

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gold/10 to-amber-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
