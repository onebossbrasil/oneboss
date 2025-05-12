
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ 
    error: Error | null;
    data: Session | null;
  }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Função para verificar se o usuário é administrador
  const checkAdminStatus = async () => {
    try {
      if (!session || !user?.email) {
        setIsAdmin(false);
        return;
      }
      
      console.log("Verificando status admin para:", user.email);
      
      // Usar RPC para chamar a função is_current_user_admin atualizada - mais seguro e eficiente
      const { data, error } = await supabase.rpc('is_current_user_admin');
      
      if (error) {
        console.error("Erro ao verificar permissões de administrador:", error);
        console.error("Detalhes da requisição:", {
          userId: user.id,
          email: user.email,
          hasValidSession: !!session
        });
        setIsAdmin(false);
        return;
      }
      
      setIsAdmin(!!data);
      console.log("Status de administrador verificado:", !!data, "para", user.email);
      
      // Para depuração adicional, vamos tentar obter o email via RPC
      try {
        const { data: emailData, error: emailError } = await supabase.rpc('get_current_user_email');
        if (!emailError && emailData) {
          console.log("Email retornado pela função RPC:", emailData);
        }
      } catch (e) {
        console.error("Erro ao obter email via RPC:", e);
      }
    } catch (err) {
      console.error("Erro ao verificar permissões:", err);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST (important for preventing auth deadlocks)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.email);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Got existing session:", currentSession?.user?.email);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Verificar status de administrador quando o usuário muda
  useEffect(() => {
    if (user) {
      checkAdminStatus();
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting sign in with:", email);
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Sign in error:", error.message);
      } else {
        console.log("Sign in successful:", data.user?.email);
        // Verificar status de admin imediatamente após login bem-sucedido
        if (data.user) {
          setUser(data.user);
          setSession(data.session);
          // Use setTimeout para evitar problemas de deadlock com auth state
          setTimeout(() => {
            checkAdminStatus();
          }, 0);
        }
      }
      
      return { data: data.session, error };
    } catch (error) {
      console.error("Error signing in:", error);
      return { data: null, error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      console.log("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoading,
        isAdmin,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
