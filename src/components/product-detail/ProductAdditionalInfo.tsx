
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Truck, ShieldCheck, Clock } from "lucide-react";

const ProductAdditionalInfo = () => {
  return (
    <Card className="my-8">
      <CardHeader>
        <CardTitle>Informações Adicionais</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col items-center text-center p-4">
            <CreditCard className="h-10 w-10 text-primary mb-4" />
            <h3 className="font-medium mb-2">Pagamento Seguro</h3>
            <p className="text-sm text-muted-foreground">
              Aceitamos os principais cartões de crédito, PIX e transferência bancária para sua conveniência.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4">
            <ShieldCheck className="h-10 w-10 text-primary mb-4" />
            <h3 className="font-medium mb-2">Produto Autêntico</h3>
            <p className="text-sm text-muted-foreground">
              Garantimos 100% de autenticidade em todos os produtos comercializados em nossa plataforma.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4">
            <Truck className="h-10 w-10 text-primary mb-4" />
            <h3 className="font-medium mb-2">Entrega Especializada</h3>
            <p className="text-sm text-muted-foreground">
              Entrega segura com opções de frete especializado para itens de alto valor.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4">
            <Clock className="h-10 w-10 text-primary mb-4" />
            <h3 className="font-medium mb-2">Suporte Dedicado</h3>
            <p className="text-sm text-muted-foreground">
              Nossa equipe de especialistas está disponível para lhe atender e esclarecer todas as suas dúvidas.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductAdditionalInfo;
