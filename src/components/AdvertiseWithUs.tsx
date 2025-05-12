
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const AdvertiseWithUs = () => {
  return (
    <section className="py-10 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-3 md:mb-4">
            Anuncie no <span className="text-gold">One Boss</span>
          </h2>
          <div className="w-16 md:w-24 h-1 bg-gold mx-auto mb-4 md:mb-6"></div>
          <p className="max-w-2xl mx-auto text-sm md:text-lg text-muted-foreground">
            Destaque sua marca e produtos exclusivos no nosso marketplace premium de luxo
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="p-6 md:p-8 border border-gold/20 hover:border-gold/40 transition-all duration-300">
            <div className="flex flex-col h-full">
              <h3 className="font-playfair text-xl md:text-2xl font-bold mb-4">Benefícios para Parceiros</h3>
              <ul className="space-y-3 text-sm md:text-base text-muted-foreground mb-6 flex-grow">
                <li className="flex items-start">
                  <span className="text-gold mr-2">✓</span>
                  <span>Exposição para clientes de alto poder aquisitivo</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">✓</span>
                  <span>Banner na seção "Parceiros Premium" da home</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">✓</span>
                  <span>Estratégias de marketing direcionadas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">✓</span>
                  <span>Integração com nossa plataforma exclusiva</span>
                </li>
              </ul>
              <Button className="bg-gold hover:bg-gold/90 text-white w-full mt-auto">
                Saiba Mais
              </Button>
            </div>
          </Card>
          
          <Card className="p-6 md:p-8 border border-gold/20 hover:border-gold/40 transition-all duration-300 bg-zinc-900">
            <div className="flex flex-col h-full">
              <h3 className="font-playfair text-xl md:text-2xl font-bold mb-4 text-white">Torne-se Parceiro</h3>
              <p className="mb-6 text-zinc-300 flex-grow">
                Entre para o seleto grupo de marcas premium que fazem parte do nosso marketplace. Nossos parceiros ganham visibilidade exclusiva e acesso a um público qualificado.
              </p>
              <div className="glassmorphism rounded-lg p-4 md:p-6 mb-6">
                <p className="text-white text-lg md:text-xl font-playfair italic">
                  "Aumente sua visibilidade e vendas através de nossa rede de clientes exclusivos"
                </p>
              </div>
              <Button 
                variant="outline" 
                className="border border-gold/30 hover:border-gold text-gold hover:bg-gold hover:text-white transition-all duration-300 w-full"
              >
                Seja nosso parceiro
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AdvertiseWithUs;
