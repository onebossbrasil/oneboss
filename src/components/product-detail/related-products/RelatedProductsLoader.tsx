
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RelatedProductsLoader = () => {
  return (
    <Card className="my-8">
      <CardHeader>
        <CardTitle>Produtos Relacionados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatedProductsLoader;
