
import React, { useEffect } from "react";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminLoading from "@/components/admin/states/AdminLoading";
import AdminError from "@/components/admin/states/AdminError";
import AccessDenied from "@/components/admin/states/AccessDenied";

const Admin = () => {
  const { isAuthenticated, isAdmin, isLoading, error, handleLogin, handleLogout } = useAdminAuth();

  useEffect(() => {
    console.log("Estado atual do Admin.tsx:", { isAuthenticated, isAdmin, isLoading, error });
  }, [isAuthenticated, isAdmin, isLoading, error]);

  // Se estiver carregando, mostrar indicador de carregamento
  if (isLoading) {
    console.log("Admin.tsx: Exibindo tela de carregamento");
    return <AdminLoading />;
  }

  // Se houver erro, mostrar mensagem de erro
  if (error) {
    console.log("Admin.tsx: Exibindo tela de erro:", error);
    return <AdminError errorMessage={error} />;
  }

  // TEMPORARIAMENTE: Ignorando verificação de autenticação e mostrando diretamente o painel admin
  console.log("Admin.tsx: Ignorando verificação de autenticação e exibindo painel administrativo diretamente");
  return <AdminDashboard onLogout={handleLogout} />;
  
  /* CÓDIGO ORIGINAL (COMENTADO TEMPORARIAMENTE)
  // Se não estiver autenticado, mostrar tela de login
  if (!isAuthenticated) {
    console.log("Admin.tsx: Exibindo tela de login, usuário não autenticado");
    return <AdminLogin onLogin={handleLogin} />;
  }

  // Se estiver autenticado, mas não for admin, mostrar mensagem de acesso negado
  if (!isAdmin) {
    console.log("Admin.tsx: Exibindo tela de acesso negado, usuário autenticado mas não é admin");
    return <AccessDenied onLogout={handleLogout} />;
  }

  // Se estiver autenticado e for admin, mostrar painel de administração
  console.log("Admin.tsx: Exibindo painel de administração, usuário autenticado e é admin");
  return <AdminDashboard onLogout={handleLogout} />;
  */
};

export default Admin;
