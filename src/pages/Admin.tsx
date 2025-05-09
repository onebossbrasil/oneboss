
import React from "react";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminLoading from "@/components/admin/states/AdminLoading";
import AdminError from "@/components/admin/states/AdminError";
import AccessDenied from "@/components/admin/states/AccessDenied";

const Admin = () => {
  const { isAuthenticated, isAdmin, isLoading, error, handleLogin, handleLogout } = useAdminAuth();

  // Se estiver carregando, mostrar indicador de carregamento
  if (isLoading) {
    return <AdminLoading />;
  }

  // Se houver erro, mostrar mensagem de erro
  if (error) {
    return <AdminError errorMessage={error} />;
  }

  // Se não estiver autenticado, mostrar tela de login
  if (!isAuthenticated) {
    console.log("Mostrando tela de login, não autenticado");
    return <AdminLogin onLogin={handleLogin} />;
  }

  // Se estiver autenticado, mas não for admin, mostrar mensagem de acesso negado
  if (!isAdmin) {
    console.log("Mostrando tela de acesso negado, não é admin");
    return <AccessDenied onLogout={handleLogout} />;
  }

  // Se estiver autenticado e for admin, mostrar painel de administração
  console.log("Mostrando painel de administração");
  return <AdminDashboard onLogout={handleLogout} />;
};

export default Admin;
