
import { Check, Shield, Award, Clock } from "lucide-react";

const features = [
  {
    icon: <Check className="w-6 h-6" />,
    title: "Seleção Rigorosa",
    description: "Todos os produtos passam por uma curadoria meticulosa, garantindo apenas o melhor."
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Autenticidade Garantida",
    description: "Certificação e verificação de autenticidade para todos os produtos exclusivos."
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Qualidade Premium",
    description: "Comprometimento com a excelência e produtos da mais alta qualidade."
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Suporte Dedicado 24/7",
    description: "Equipe de atendimento exclusivo sempre à disposição para assistência."
  }
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 px-4 md:px-8 bg-secondary/5">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
            Por que escolher <span className="text-gold">ONE✦BOSS</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Nosso marketplace é sinônimo de exclusividade, oferecendo uma experiência de compra incomparável para clientes que valorizam o extraordinário.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="glassmorphism p-6 rounded-xl hover:shadow-lg hover:shadow-gold/10 transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-4">
                  <div className="text-gold">{feature.icon}</div>
                </div>
                <h3 className="font-playfair font-semibold text-xl mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
