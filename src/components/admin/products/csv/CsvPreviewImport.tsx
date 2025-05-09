
import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ImportedProduct } from "@/types/csv";

interface CsvPreviewImportProps {
  errors: string[];
  importedProducts: ImportedProduct[];
  processImport: () => void;
  setPreviewMode: (mode: boolean) => void;
  isImporting: boolean;
}

const CsvPreviewImport: React.FC<CsvPreviewImportProps> = ({ 
  errors, 
  importedProducts, 
  processImport, 
  setPreviewMode,
  isImporting
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Pré-visualização da importação</h3>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => setPreviewMode(false)}>
            Voltar
          </Button>
          <Button onClick={processImport} disabled={isImporting}>
            {isImporting ? "Processando..." : "Confirmar Importação"}
          </Button>
        </div>
      </div>
      
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-medium mb-1">Encontramos {errors.length} erro(s):</p>
            <ul className="list-disc pl-5 space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="text-sm">{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      {importedProducts.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm">
            {importedProducts.length} produtos serão importados
          </p>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Destaque</TableHead>
                  <TableHead>Imagens</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {importedProducts.slice(0, 5).map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.featured ? "Sim" : "Não"}</TableCell>
                    <TableCell>{product.images.length} imagens</TableCell>
                  </TableRow>
                ))}
                {importedProducts.length > 5 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                      ...e mais {importedProducts.length - 5} produtos
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CsvPreviewImport;
