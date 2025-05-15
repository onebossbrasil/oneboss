
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Painel para diagnóstico de permissões admin.
 */
const AdminDebugPanel = () => {
  const { session, user, isAdmin } = useAuth();
  const [rpcEmail, setRpcEmail] = useState<string | null>(null);
  const [rpcIsAdmin, setRpcIsAdmin] = useState<boolean | null>(null);
  const [permissionsRow, setPermissionsRow] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [tokenShort, setTokenShort] = useState<string | null>(null);

  // Busca dados do banco via RPC
  useEffect(() => {
    const fetchDebugInfo = async () => {
      setLoading(true);
      try {
        // e-mail vindo do token via função RPC
        const { data: emailData, error: emailErr } = await supabase.rpc('get_current_user_email');
        setRpcEmail(emailData ?? null);
        if (emailErr) {
          console.error("Erro get_current_user_email RPC:", emailErr);
        }

        // checa permissao de admin via função
        const { data: adminData, error: adminErr } = await supabase.rpc('is_current_user_admin');
        setRpcIsAdmin(adminData);
        if (adminErr) {
          console.error("Erro is_current_user_admin RPC:", adminErr);
        }

        // checar se existe permissao registrada na tabela admin_permissions
        let emailToCheck = user?.email || emailData || "";
        const { data: permData, error: permErr } = await supabase
          .from("admin_permissions")
          .select("*")
          .eq("email", emailToCheck)
          .maybeSingle();
        setPermissionsRow(permData ?? null);
        if (permErr) {
          console.error("Erro consultando admin_permissions:", permErr);
        }

        // Shorten JWT token para debug
        if (session?.access_token) {
          setTokenShort(session.access_token.substring(0, 12) + "..." + session.access_token.slice(-8));
        }

      } catch (err) {
        console.error("Erro ao buscar informacoes de debug admin:", err);
      }
      setLoading(false);
    };
    fetchDebugInfo();
  }, [user?.email, session?.access_token]);

  return (
    <div className="my-8">
      <Card className="bg-gray-50 border-l-4 border-gold shadow w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle className="text-gold text-lg font-semibold">
            Painel de Diagnóstico Admin
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <b>Email logado (context):</b> {user?.email || <span className="text-muted-foreground">N/A</span>}
          </div>
          <div>
            <b>Email via RPC:</b> {rpcEmail || <span className="text-muted-foreground">N/A</span>}
          </div>
          <div>
            <b>isAdmin (context):</b>{" "}
            <span className={isAdmin ? "text-green-600" : "text-red-600"}>{String(isAdmin)}</span>
          </div>
          <div>
            <b>is_current_user_admin() (via RPC):</b>{" "}
            <span className={rpcIsAdmin ? "text-green-600" : "text-red-600"}>{String(rpcIsAdmin)}</span>
          </div>
          <div>
            <b>Permissão na admin_permissions:</b>{" "}
            {permissionsRow
              ? <span className="text-green-600">SIM</span>
              : <span className="text-red-600">NÃO</span>
            }
          </div>
          {permissionsRow && (
            <div className="ml-4">
              <pre className="text-xs bg-gray-100 p-2 rounded">{JSON.stringify(permissionsRow, null, 2)}</pre>
            </div>
          )}
          <div>
            <b>session?.access_token:</b> {tokenShort}
          </div>
          <div>
            <b>ID do usuário (context):</b> {user?.id}
          </div>
          <div className="pt-2">
            <Alert variant="destructive">
              <AlertTitle>Ajuda para resolver permissões?</AlertTitle>
              <AlertDescription>
                Caso mesmo assim apresente erro de permissão, verifique se <b>todos os emails coincidem</b> (case sensitive, sem espaços), e copie os resultados deste painel para enviar ao suporte.
              </AlertDescription>
            </Alert>
          </div>
          {loading && (
            <div className="text-xs text-gray-600">Carregando...</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDebugPanel;
