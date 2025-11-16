import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AccountDeletion = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [email, setEmail] = useState("");

  const handleDeleteRequest = async () => {
    if (!email || !email.includes("@")) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      });
      return;
    }

    // TODO: Implementar chamada para edge function do Supabase
    console.log("Solicitação de exclusão para:", email);

    toast({
      title: "Solicitação enviada",
      description: "Sua solicitação de exclusão de conta foi recebida. Você receberá um email de confirmação em breve.",
    });

    setEmail("");
    setShowDialog(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-100 rounded-full">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Cancelamento de Conta
            </h1>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Solicitação de Exclusão de Conta
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Você pode solicitar a exclusão permanente da sua conta OneBoss Brasil a qualquer momento.
                Esta ação é irreversível e resultará na remoção de todos os seus dados pessoais de nossos sistemas.
              </p>
            </section>

            <section className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-900 mb-2">
                    Antes de solicitar a exclusão
                  </h3>
                  <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                    <li>Você perderá acesso permanente à sua conta</li>
                    <li>Todos os seus dados pessoais serão excluídos</li>
                    <li>Histórico de pedidos e transações será removido</li>
                    <li>Avaliações e comentários serão deletados</li>
                    <li>Esta ação não pode ser desfeita</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Como funciona o processo?
              </h3>
              <ol className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </span>
                  <span>
                    <strong>Solicitação:</strong> Clique no botão abaixo e confirme seu email
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </span>
                  <span>
                    <strong>Confirmação:</strong> Você receberá um email com instruções para confirmar a exclusão
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    3
                  </span>
                  <span>
                    <strong>Processamento:</strong> Após confirmação, sua conta será excluída em até 48 horas
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    4
                  </span>
                  <span>
                    <strong>Conclusão:</strong> Você receberá uma confirmação final quando a exclusão for concluída
                  </span>
                </li>
              </ol>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Dados que serão excluídos
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  Nome e informações pessoais
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  Email e telefone
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  Endereços cadastrados
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  Histórico de pedidos
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  Avaliações e comentários
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  Preferências e configurações
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Dados retidos por obrigação legal
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                De acordo com a legislação brasileira, alguns dados relacionados a transações financeiras
                e fiscais podem ser mantidos por períodos específicos para cumprimento de obrigações legais,
                mesmo após a exclusão da conta. Estes dados são armazenados de forma segura e restrita.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Precisa de ajuda?
              </h3>
              <p className="text-gray-700 mb-3">
                Se você está enfrentando problemas com sua conta ou tem dúvidas, nossa equipe de suporte
                pode ajudar antes de você decidir excluir sua conta.
              </p>
              <p className="text-gray-700">
                Entre em contato:{" "}
                <a
                  href="mailto:suporte@onebossbrasil.com.br"
                  className="text-primary hover:underline font-medium"
                >
                  suporte@onebossbrasil.com.br
                </a>
              </p>
            </section>

            <div className="pt-6 border-t">
              <Button
                variant="destructive"
                size="lg"
                onClick={() => setShowDialog(true)}
                className="w-full sm:w-auto"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Solicitar Exclusão de Conta
              </Button>
            </div>
          </div>
        </div>

        <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão de conta</AlertDialogTitle>
              <AlertDialogDescription className="space-y-4">
                <p>
                  Esta ação é irreversível. Todos os seus dados serão permanentemente excluídos.
                </p>
                <div>
                  <label htmlFor="email-confirm" className="block text-sm font-medium text-gray-700 mb-2">
                    Digite seu email para confirmar:
                  </label>
                  <input
                    id="email-confirm"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteRequest}
                className="bg-red-600 hover:bg-red-700"
              >
                Confirmar Exclusão
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AccountDeletion;
