
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const EasySampleAdmin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const createAdminAccess = async () => {
    try {
      setIsLoading(true);
      console.log("Iniciando configuração de acesso admin...");
      
      // 1. Verificar permissões de admin existentes primeiro
      const { data: existingAdmin, error: adminCheckError } = await supabase
        .from('admin_permissions')
        .select('*')
        .eq('email', 'admin@example.com')
        .maybeSingle();
      
      if (adminCheckError && adminCheckError.code !== 'PGRST116') {
        console.error("Erro ao verificar permissões de admin:", adminCheckError);
        throw new Error(`Erro ao verificar permissões de admin: ${adminCheckError.message}`);
      }
      
      // Adicionar permissões de admin primeiro
      if (!existingAdmin) {
        console.log("Adicionando permissões de admin para admin@example.com");
        const { error: permissionError } = await supabase
          .from('admin_permissions')
          .insert({
            email: 'admin@example.com',
            role: 'admin'
          });
        
        if (permissionError) {
          console.error("Erro ao adicionar permissões de admin:", permissionError);
          throw new Error(`Erro ao adicionar permissões de admin: ${permissionError.message}`);
        }
        
        console.log("Permissões de admin adicionadas com sucesso.");
      } else {
        console.log("Permissões de admin já existem:", existingAdmin);
      }
      
      // 2. Tentar fazer login se o usuário já existe
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'admin@example.com',
        password: 'admin123',
      });
      
      // Se o login funcionar, significa que o usuário já existe
      if (!signInError && authData?.user) {
        console.log("Login realizado com sucesso para usuário existente:", authData.user.email);
        
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para o painel administrativo.",
        });
        
        navigate("/admin");
        return;
      }
      
      // 3. Se não conseguiu login, tente criar o usuário
      console.log("Criando novo usuário admin...");
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: 'admin@example.com',
        password: 'admin123',
      });
      
      if (signUpError) {
        console.error("Erro ao criar usuário admin:", signUpError);
        throw new Error(`Erro ao criar usuário admin: ${signUpError.message}`);
      }
      
      console.log("Usuário admin criado com sucesso:", signUpData?.user?.email);
      
      // 4. Fazer login com as credenciais criadas
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: 'admin@example.com',
        password: 'admin123',
      });
      
      if (loginError) {
        console.error("Erro ao fazer login após criar usuário:", loginError);
        throw new Error(`Erro ao fazer login após criar usuário: ${loginError.message}`);
      }
      
      console.log("Login realizado com sucesso após criar usuário:", loginData.user?.email);
      
      toast({
        title: "Acesso de admin configurado com sucesso!",
        description: "Redirecionando para o painel administrativo.",
      });
      
      navigate("/admin");
      
    } catch (error: any) {
      console.error("Erro ao criar acesso admin:", error);
      toast({
        title: "Erro ao configurar acesso admin",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={createAdminAccess} 
      disabled={isLoading}
      className="bg-gold hover:bg-gold/90 text-white"
    >
      {isLoading ? "Configurando..." : "Acesso Rápido ao Admin"}
    </Button>
  );
};

export default EasySampleAdmin;
