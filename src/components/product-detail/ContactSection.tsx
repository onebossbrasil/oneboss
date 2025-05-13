
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PhoneCall, Mail, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLeads } from "@/contexts/LeadContext";

interface ContactSectionProps {
  productName: string;
  productId: string;
}

const ContactSection = ({ productName, productId }: ContactSectionProps) => {
  const { toast } = useToast();
  const { addLead } = useLeads();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast({
        title: "Formulário incompleto",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create the lead using the context function
      await addLead({
        name,
        email,
        phone,
        message: `Interesse no produto: ${productName}. Mensagem: ${message}`,
        productId
      });
      
      toast({
        title: "Mensagem enviada",
        description: "Em breve, um de nossos consultores entrará em contato.",
      });
      
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erro ao enviar mensagem",
        description: "Por favor tente novamente ou entre em contato por telefone.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="my-8">
      <CardHeader>
        <CardTitle>Fale com um especialista</CardTitle>
        <CardDescription>
          Preencha o formulário abaixo para obter mais informações sobre {productName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input 
                    id="name" 
                    placeholder="Seu nome completo" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="seu@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input 
                  id="phone" 
                  placeholder="(00) 00000-0000" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Mensagem *</Label>
                <Textarea 
                  id="message" 
                  placeholder={`Olá, gostaria de mais informações sobre ${productName}`}
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Mensagem
                  </>
                )}
              </Button>
            </form>
          </div>
          
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-muted rounded-lg p-6">
              <h3 className="font-medium text-lg mb-4">Informações de Contato</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <PhoneCall className="h-5 w-5 mr-3 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Telefone</p>
                    <p className="text-sm text-muted-foreground">+55 (00) 0000-0000</p>
                    <p className="text-sm text-muted-foreground">Seg-Sex, 9h às 18h</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-5 w-5 mr-3 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">contato@oneboss.com.br</p>
                    <p className="text-sm text-muted-foreground">Resposta em até 24h</p>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t">
                  <p className="text-sm text-center text-muted-foreground">
                    Nossos especialistas estão prontos para ajudar a encontrar o produto perfeito para você.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground">
        <p>* Campos obrigatórios</p>
        <p>Seus dados estão seguros e não serão compartilhados com terceiros</p>
      </CardFooter>
    </Card>
  );
};

export default ContactSection;
