
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
      
      // 1. Verificar se já existe uma conta de admin de exemplo
      const { data: existingData, error: checkError } = await supabase
        .from('admin_permissions')
        .select('*')
        .eq('email', 'admin@example.com')
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      // Se já existe, não precisamos criar novamente
      if (existingData) {
        toast({
          title: "Acesso de admin já configurado",
          description: "Use admin@example.com e senha 'admin123' para acessar.",
        });
        navigate("/admin");
        return;
      }
      
      // 2. Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: 'admin@example.com',
        password: 'admin123',
      });
      
      if (authError) {
        // Se o usuário já existe, podemos prosseguir
        if (!authError.message.includes("already")) {
          throw authError;
        }
      }
      
      // 3. Adicionar permissões de admin
      const { error: adminError } = await supabase
        .from('admin_permissions')
        .insert({
          email: 'admin@example.com',
          role: 'admin'
        });
      
      if (adminError) {
        throw adminError;
      }
      
      // 4. Exibir toast de sucesso
      toast({
        title: "Acesso de admin criado com sucesso!",
        description: "Use admin@example.com e senha 'admin123' para acessar.",
      });
      
      // 5. Redirecionar para a página de admin
      navigate("/admin");
      
    } catch (error: any) {
      console.error("Erro ao criar acesso admin:", error);
      toast({
        title: "Erro ao criar acesso admin",
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
