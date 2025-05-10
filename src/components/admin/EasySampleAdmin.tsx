
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
      
      // 1. Verificar se já existe uma conta de admin de exemplo
      const { data: existingData, error: checkError } = await supabase
        .from('admin_permissions')
        .select('*')
        .eq('email', 'admin@example.com')
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error("Erro ao verificar admin existente:", checkError);
        throw checkError;
      }
      
      // Se já existe, tentamos fazer login diretamente
      if (existingData) {
        console.log("Admin já existe, tentando fazer login...");
        
        // Tenta fazer login com as credenciais do admin
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: 'admin@example.com',
          password: 'admin123',
        });
        
        if (signInError) {
          console.error("Erro ao fazer login com admin existente:", signInError);
          throw signInError;
        }
        
        console.log("Login realizado com sucesso:", signInData.user?.email);
        
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para o painel administrativo.",
        });
        
        navigate("/admin");
        return;
      }
      
      console.log("Admin não existe, criando novo usuário...");
      
      // 2. Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: 'admin@example.com',
        password: 'admin123',
      });
      
      if (authError) {
        // Se o usuário já existe, tentamos fazer login
        if (authError.message.includes("already")) {
          console.log("Usuário já existe, tentando fazer login...");
          
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: 'admin@example.com',
            password: 'admin123',
          });
          
          if (signInError) {
            console.error("Erro ao fazer login após verificar usuário existente:", signInError);
            throw signInError;
          }
          
          console.log("Login realizado com sucesso após verificar usuário existente:", signInData.user?.email);
        } else {
          console.error("Erro ao criar usuário:", authError);
          throw authError;
        }
      } else {
        console.log("Usuário criado com sucesso:", authData.user?.email);
      }
      
      // 3. Adicionar permissões de admin (se ainda não existirem)
      const { error: adminError } = await supabase
        .from('admin_permissions')
        .insert({
          email: 'admin@example.com',
          role: 'admin'
        })
        .select()
        .single();
      
      if (adminError) {
        // Se o erro for que o registro já existe, isso é ok
        if (!adminError.message.includes("already exists")) {
          console.error("Erro ao adicionar permissões de admin:", adminError);
          throw adminError;
        } else {
          console.log("Permissões de admin já existem");
        }
      } else {
        console.log("Permissões de admin adicionadas com sucesso");
      }
      
      // 4. Exibir toast de sucesso
      toast({
        title: "Acesso de admin configurado com sucesso!",
        description: "Redirecionando para o painel administrativo.",
      });
      
      // 5. Redirecionar para a página de admin
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
