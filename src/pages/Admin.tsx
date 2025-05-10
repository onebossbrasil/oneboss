
import React from "react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logout simulado",
      description: "Em um sistema real, você seria desconectado."
    });
  };

  // Renderizar diretamente o painel administrativo sem verificações de autenticação
  return <AdminDashboard onLogout={handleLogout} />;
};

export default Admin;
