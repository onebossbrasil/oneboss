import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Política de Privacidade – OneBoss Brasil
          </h1>

          <p className="text-sm text-gray-600 mb-8">
            Última atualização: [colocar data]
          </p>

          <div className="prose prose-gray max-w-none space-y-6">
            <p>
              A OneBoss Brasil ("nós", "nosso", "plataforma") valoriza a privacidade de seus usuários e está comprometida em proteger as informações pessoais coletadas em nosso site (onebossbrasil.com.br) e aplicativo móvel.
            </p>

            <p>
              Esta Política de Privacidade descreve como coletamos, usamos, armazenamos, compartilhamos e protegemos os dados pessoais dos usuários, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018), bem como outras legislações aplicáveis.
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                1. Informações que Coletamos
              </h2>
              <p className="mb-3">Podemos coletar as seguintes informações:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Dados de cadastro:</strong> nome, e-mail, telefone, CPF/CNPJ, endereço, senha de acesso.
                </li>
                <li>
                  <strong>Dados de pagamento:</strong> informações de cartões, contas bancárias ou métodos de pagamento, processados de forma segura por intermediários autorizados.
                </li>
                <li>
                  <strong>Dados de navegação:</strong> endereço IP, localização aproximada, tipo de dispositivo, sistema operacional, navegador, interações dentro da plataforma.
                </li>
                <li>
                  <strong>Conteúdo gerado pelo usuário:</strong> avaliações, comentários, mensagens e informações relacionadas a compras e vendas.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                2. Como Utilizamos os Dados
              </h2>
              <p className="mb-3">Os dados coletados são utilizados para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Criar e gerenciar contas de usuários;</li>
                <li>Processar pedidos, pagamentos e transações;</li>
                <li>Permitir comunicação entre compradores e vendedores;</li>
                <li>Oferecer suporte ao cliente;</li>
                <li>Enviar notificações importantes (atualizações de pedidos, termos e políticas);</li>
                <li>Personalizar a experiência do usuário e recomendar produtos;</li>
                <li>Garantir segurança, prevenção de fraudes e cumprimento de requisitos legais.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                3. Compartilhamento de Dados
              </h2>
              <p className="mb-3">Podemos compartilhar informações pessoais apenas quando necessário:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Com vendedores e compradores, para viabilizar transações;</li>
                <li>Com prestadores de serviços (meios de pagamento, hospedagem, segurança de dados, logística);</li>
                <li>Para cumprimento legal, em caso de ordem judicial, solicitação de autoridades ou investigações;</li>
                <li>Em operações comerciais, como fusão, aquisição ou reestruturação do negócio.</li>
              </ul>
              <p className="mt-3 font-semibold">Não vendemos informações pessoais a terceiros.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                4. Armazenamento e Segurança
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Os dados são armazenados em servidores seguros, localizados no Brasil e/ou no exterior.</li>
                <li>Adotamos medidas técnicas e administrativas para proteger informações contra acessos não autorizados, perdas ou alterações.</li>
                <li>O usuário é responsável por manter suas credenciais de acesso em sigilo.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                5. Direitos dos Usuários
              </h2>
              <p className="mb-3">Em conformidade com a LGPD, você pode:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Confirmar a existência de tratamento de dados;</li>
                <li>Solicitar acesso, correção ou exclusão de dados pessoais;</li>
                <li>Solicitar portabilidade dos dados;</li>
                <li>Revogar consentimentos concedidos;</li>
                <li>Solicitar informações sobre compartilhamento de dados.</li>
              </ul>
              <p className="mt-3">
                Para exercer seus direitos, entre em contato através do e-mail:{" "}
                <a href="mailto:privacidade@onebossbrasil.com.br" className="text-primary hover:underline">
                  privacidade@onebossbrasil.com.br
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                6. Uso de Cookies e Tecnologias Similares
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Utilizamos cookies para melhorar a navegação, personalizar conteúdos e analisar estatísticas.</li>
                <li>O usuário pode gerenciar ou desativar cookies nas configurações do navegador.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                7. Serviços de Terceiros
              </h2>
              <p>
                Nosso aplicativo e site podem conter integrações de serviços de terceiros (como Google, Apple, provedores de pagamento e logística).
                Esses terceiros podem coletar informações conforme suas próprias políticas de privacidade.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                8. Retenção de Dados
              </h2>
              <p>
                Os dados serão mantidos apenas pelo período necessário para atender às finalidades descritas nesta Política, respeitando requisitos legais e regulatórios.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                9. Alterações nesta Política
              </h2>
              <p>
                A OneBoss Brasil pode atualizar esta Política de Privacidade periodicamente. As alterações entrarão em vigor a partir da data de publicação no site e no aplicativo.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                10. Contato
              </h2>
              <p>
                🌐{" "}
                <a href="https://onebossbrasil.com.br" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  onebossbrasil.com.br
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
