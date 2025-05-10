
import { useState, useEffect } from "react";
import { useProducts } from "@/contexts/ProductContext";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProductTableRow from "./ProductTableRow";
import ProductEditDialog from "./ProductEditDialog";
import { Product } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function ProductList() {
  const { products, refreshProducts, isLoading, error } = useProducts();
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Load products at mount
    refreshProducts();
  }, [refreshProducts]);

  useEffect(() => {
    // Show toast of error if there's a problem loading products
    if (error) {
      toast({
        title: "Erro ao carregar produtos",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setSelectedProduct(null);
    setDialogOpen(false);
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshProducts();
    setIsRefreshing(false);
    
    toast({
      title: "Lista atualizada",
      description: "Os dados foram sincronizados com o banco de dados",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Produtos Cadastrados</h3>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleManualRefresh}
          disabled={isLoading || isRefreshing}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Atualizar</span>
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Problema de conexão</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="w-full sm:w-auto mt-2"
            >
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Imagem</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead className="text-center">Publicado</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <ProductEmptyState />
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <ProductTableRow 
                      key={product.id} 
                      product={product} 
                      onEditClick={handleEditClick} 
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <ProductEditDialog 
        product={selectedProduct}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onClose={handleDialogClose}
      />
    </div>
  );
}

const ProductEmptyState = () => (
  <td colSpan={6} className="text-center py-4 text-muted-foreground">
    Nenhum produto cadastrado
  </td>
);
