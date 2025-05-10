
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

export default function ProductList() {
  const { products, refreshProducts, isLoading, error } = useProducts();
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    // Carregar produtos ao montar o componente
    refreshProducts();
  }, [refreshProducts]);

  useEffect(() => {
    // Mostrar toast de erro se houver algum problema ao carregar os produtos
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

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Produtos Cadastrados</h3>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
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
      )}

      <ProductEditDialog 
        product={selectedProduct}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}

const ProductEmptyState = () => (
  <td colSpan={6} className="text-center py-4 text-muted-foreground">
    Nenhum produto cadastrado
  </td>
);
