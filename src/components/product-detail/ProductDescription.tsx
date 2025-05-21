import { useState } from "react";
import { Product } from "@/types/product";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductDescriptionProps {
  product: Product;
}

const ProductDescription = ({ product }: ProductDescriptionProps) => {
  const [activeTab, setActiveTab] = useState("descricao");
  
  // Function to handle HTML content safely
  const createMarkup = (htmlContent: string) => {
    return { __html: htmlContent };
  };

  return (
    <Card className="my-8">
      <Tabs defaultValue="descricao" value={activeTab} onValueChange={setActiveTab}>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <CardTitle>Informações do Produto</CardTitle>
            <TabsList>
              <TabsTrigger value="descricao">Descrição</TabsTrigger>
              <TabsTrigger value="especificacoes">Especificações</TabsTrigger>
              <TabsTrigger value="garantia">Garantia</TabsTrigger>
            </TabsList>
          </div>
        </CardHeader>
        
        <CardContent>
          <TabsContent value="descricao" className="mt-0">
            {product.description ? (
              <div 
                className="prose prose-stone max-w-none"
                dangerouslySetInnerHTML={createMarkup(product.description)} 
              />
            ) : (
              <CardDescription>
                Este produto não possui uma descrição detalhada no momento.
              </CardDescription>
            )}
          </TabsContent>
          
          <TabsContent value="especificacoes" className="mt-0">
            <div className="border rounded-md">
              <table className="w-full text-sm">
                <tbody className="divide-y">
                  <tr className="divide-x">
                    <th className="p-3 text-left bg-muted/50 w-1/3 font-medium">Nome do Produto</th>
                    <td className="p-3">{product.name}</td>
                  </tr>
                  <tr className="divide-x">
                    <th className="p-3 text-left bg-muted/50 w-1/3 font-medium">Código do Produto</th>
                    <td className="p-3 font-mono">{product.id}</td>
                  </tr>
                  {product.stockQuantity > 0 && (
                    <tr className="divide-x">
                      <th className="p-3 text-left bg-muted/50 w-1/3 font-medium">Disponibilidade</th>
                      <td className="p-3">
                        {product.stockQuantity} {product.stockQuantity === 1 ? "unidade" : "unidades"} em estoque
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="garantia" className="mt-0">
            <div className="prose prose-stone max-w-none">
              <h3>Política de Garantia</h3>
              <p>
                Todos os produtos da ONE BOSS Luxury Marketplace possuem garantia contra defeitos de fabricação conforme as políticas de cada fabricante.
              </p>
              <p>
                Itens exclusivos e raros podem ter condições especiais de garantia. Entre em contato com nosso time de atendimento para informações detalhadas sobre a garantia deste item específico.
              </p>
              <h4>Importante:</h4>
              <ul>
                <li>A garantia cobre apenas defeitos de fabricação</li>
                <li>Danos causados por mau uso não são cobertos pela garantia</li>
                <li>É necessário apresentar comprovante de compra para acionar a garantia</li>
              </ul>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default ProductDescription;
