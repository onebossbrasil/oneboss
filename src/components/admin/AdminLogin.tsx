import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AdminLoginProps {
  onLogin: (success: boolean) => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn, session, isAdmin } = useAuth();
  
  // Mantenha o email pré-preenchido para facilitar os testes
  const [email, setEmail] = useState("mar.medeiros2015@gmail.com");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStatus, setForgotStatus] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  // Verificar se já está autenticado ao carregar
  useEffect(() => {
    if (session) {
      console.log("AdminLogin: Usuário já autenticado como", session.user?.email);
      if (isAdmin) {
        onLogin(true);
        navigate("/admin");
      } else {
        setError("Esta conta não possui permissões de administrador.");
      }
    }
  }, [session, navigate, onLogin, isAdmin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log("Iniciando login com:", email);
      const { data: session, error } = await signIn(email, password);
      
      if (error) {
        console.error("Login error:", error);
        setError("Falha na autenticação. Verifique seu e-mail e senha.");
        onLogin(false);
        toast({
          title: "Erro no login",
          description: "Credenciais inválidas. Tente novamente.",
          variant: "destructive",
        });
      } else if (session) {
        console.log("Login bem-sucedido:", session.user.email);
        console.log("Access token:", session.access_token?.substring(0, 15) + "...");
        toast({
          title: "Login realizado",
          description: "Você está sendo redirecionado ao painel administrativo.",
        });
        onLogin(true);
        navigate("/admin");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("Ocorreu um erro ao processar o login.");
      onLogin(false);
      toast({
        title: "Erro no sistema",
        description: "Não foi possível processar o login. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotStatus("");
    try {
      if (!forgotEmail) {
        setForgotStatus("Informe um e-mail válido.");
        setForgotLoading(false);
        return;
      }
      const { error } = await (window as any).supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: window.location.origin + "/admin"
      });
      if (error) {
        setForgotStatus("Não foi possível enviar o e-mail. Revise o endereço digitado.");
        toast({
          title: "Erro ao enviar e-mail",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setForgotStatus("Verifique seu e-mail e siga o link enviado para redefinir sua senha.");
        toast({
          title: "Redefinição enviada",
          description: "Verifique sua caixa de entrada para redefinir sua senha."
        });
      }
    } catch (err: any) {
      setForgotStatus("Erro ao solicitar redefinição.");
      toast({
        title: "Erro ao solicitar redefinição",
        description: err?.message || "",
        variant: "destructive"
      });
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Acesso Administrativo</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {showForgot ? (
            <form className="space-y-4" onSubmit={handleForgotPassword}>
              <div className="space-y-2">
                <Label htmlFor="forgotEmail">Email cadastrado</Label>
                <Input
                  id="forgotEmail"
                  type="email"
                  autoComplete="email"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  placeholder="seu-email@exemplo.com"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={forgotLoading}
              >
                {forgotLoading ? "Enviando..." : "Enviar redefinição"}
              </Button>
              <Button
                type="button"
                className="w-full mt-2"
                variant="outline"
                onClick={() => { setShowForgot(false); setForgotStatus(""); }}
              >
                Voltar para login
              </Button>
              {forgotStatus && (
                <div className="text-sm text-center mt-2 text-muted-foreground">{forgotStatus}</div>
              )}
            </form>
          ) : (
            <>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu-email@exemplo.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Autenticando..." : "Entrar"}
                </Button>
              </form>
              <Button
                type="button"
                className="w-full mt-2"
                variant="ghost"
                onClick={() => setShowForgot(true)}
              >
                Esqueci a senha
              </Button>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          <div className="text-center">
            <p>Acesso restrito a administradores</p>
            <p className="mt-2 text-xs text-muted-foreground">Credenciais padrão: mar.medeiros2015@gmail.com</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
