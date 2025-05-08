
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ProductDetailsForm = () => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Nome do Produto</Label>
        <Input id="name" placeholder="Ex: BMW X5 M Competition" required />
      </div>
      
      <div>
        <Label htmlFor="price">Preço</Label>
        <Input id="price" placeholder="Ex: R$ 850.000,00" required />
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          placeholder="Detalhes do produto..."
          className="min-h-32"
          required
        />
      </div>
    </div>
  );
};

export default ProductDetailsForm;
