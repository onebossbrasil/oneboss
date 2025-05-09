
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Key, LogIn, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AdminLoginProps {
  onLogin: (success: boolean) => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      console.log("Tentando autenticar com:", { email });
      
      // Autenticar com Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error("Erro de autenticação:", authError);
        throw authError;
      }

      if (!data.user || !data.user.email) {
        console.error("Dados do usuário não disponíveis");
        throw new Error("Não foi possível obter os dados do usuário.");
      }

      console.log("Autenticação bem-sucedida para:", data.user.email);
      
      // Verificar se o e-mail está na tabela de permissões
      const { data: adminData, error: adminError } = await supabase
        .from('admin_permissions')
        .select('*')
        .eq('email', data.user.email)
        .single();
      
      console.log("Verificação de permissões de admin:", { adminData, adminError });

      if (adminError || !adminData) {
        console.error("Erro ou nenhum dado encontrado na verificação de permissões:", adminError);
        throw new Error("Acesso não autorizado. Você não tem permissões de administrador.");
      }
      
      // Se chegou aqui, o usuário é administrador
      const adminRole = adminData.role || "admin";

      onLogin(true);
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo ao painel administrativo, ${adminRole}.`,
      });
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Falha na autenticação. Verifique suas credenciais.");
      toast({
        title: "Falha na autenticação",
        description: "Usuário ou senha incorretos, ou sem permissões de administrador.",
        variant: "destructive",
      });
      onLogin(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            <span className="font-playfair">Loja <span className="text-gold">Premium</span></span>
          </CardTitle>
          <p className="text-center text-muted-foreground">
            Acesso administrativo
          </p>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Key className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              <LogIn className="mr-2 h-4 w-4" />
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
