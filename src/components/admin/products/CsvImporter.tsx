
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileImage, AlertTriangle, Check } from "lucide-react";
import CsvPreviewTable from "./CsvPreviewTable";
import CsvColumnMapper from "./CsvColumnMapper";
import { useCategories } from "@/contexts/CategoryContext";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

interface ImportedProduct {
  name: string;
  price: string;
  description: string;
  category: string;
  subcategories?: string;
  featured: boolean;
  images: string[];
  stockQuantity: number;
}

interface ParsedCsvRow {
  [key: string]: string;
}

const CsvImporter = () => {
  const { toast } = useToast();
  const { categories } = useCategories();
  
  const [file, setFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedCsvRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [previewMode, setPreviewMode] = useState(false);
  const [importedProducts, setImportedProducts] = useState<ImportedProduct[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreviewMode(false);
    setSuccess(false);
    setErrors([]);
    
    if (e.target.files && e.target.files[0]) {
      const csvFile = e.target.files[0];
      setFile(csvFile);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          try {
            const csvData = event.target.result;
            const lines = csvData.split('\n');
            const headers = lines[0].split(',').map(h => h.trim());
            setHeaders(headers);
            
            // Initialize mapping to suggested defaults
            const initialMapping: Record<string, string> = {};
            headers.forEach(header => {
              const lowerHeader = header.toLowerCase();
              if (lowerHeader.includes('nome') || lowerHeader.includes('name')) initialMapping[header] = 'name';
              else if (lowerHeader.includes('preço') || lowerHeader.includes('price')) initialMapping[header] = 'price';
              else if (lowerHeader.includes('desc')) initialMapping[header] = 'description';
              else if (lowerHeader.includes('categ')) initialMapping[header] = 'category';
              else if (lowerHeader.includes('subcateg')) initialMapping[header] = 'subcategories';
              else if (lowerHeader.includes('destaque') || lowerHeader.includes('featured')) initialMapping[header] = 'featured';
              else if (lowerHeader.includes('imag') || lowerHeader.includes('image')) initialMapping[header] = 'images';
              else if (lowerHeader.includes('estoque') || lowerHeader.includes('stock')) initialMapping[header] = 'stockQuantity';
            });
            setMapping(initialMapping);
            
            // Parse rows
            const rows = lines.slice(1).filter(line => line.trim() !== '').map(line => {
              const values = line.split(',').map(v => v.trim());
              const row: Record<string, string> = {};
              headers.forEach((header, index) => {
                row[header] = values[index] || '';
              });
              return row;
            });
            
            setParsedData(rows);
            
          } catch (error) {
            setErrors(['Erro ao analisar o arquivo CSV. Verifique o formato.']);
          }
        }
      };
      reader.readAsText(csvFile);
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };
  
  const previewImport = () => {
    const importErrors: string[] = [];
    const products: ImportedProduct[] = [];
    
    parsedData.forEach((row, index) => {
      try {
        const product: ImportedProduct = {
          name: '',
          price: '',
          description: '',
          category: '',
          subcategories: '',
          featured: false,
          images: [],
          stockQuantity: 0
        };
        
        // Map fields according to user's mapping
        Object.entries(mapping).forEach(([csvHeader, productField]) => {
          if (productField === 'name') product.name = row[csvHeader];
          else if (productField === 'price') product.price = row[csvHeader];
          else if (productField === 'description') product.description = row[csvHeader];
          else if (productField === 'category') product.category = row[csvHeader];
          else if (productField === 'subcategories') product.subcategories = row[csvHeader];
          else if (productField === 'featured') product.featured = row[csvHeader]?.toLowerCase() === 'sim' || row[csvHeader]?.toLowerCase() === 'true';
          else if (productField === 'images') {
            const imageUrls = row[csvHeader]?.split('|').filter(url => url.trim() !== '');
            product.images = imageUrls || [];
          }
          else if (productField === 'stockQuantity') {
            product.stockQuantity = parseInt(row[csvHeader], 10) || 0;
          }
        });
        
        // Validate required fields
        if (!product.name) {
          importErrors.push(`Linha ${index + 2}: Nome do produto é obrigatório`);
          return;
        }
        
        if (!product.price) {
          importErrors.push(`Linha ${index + 2}: Preço do produto é obrigatório`);
          return;
        }
        
        // Validate category exists
        if (product.category && !categories.some(c => c.name.toLowerCase() === product.category.toLowerCase())) {
          importErrors.push(`Linha ${index + 2}: Categoria "${product.category}" não encontrada`);
          return;
        }
        
        products.push(product);
      } catch (error) {
        importErrors.push(`Erro ao processar linha ${index + 2}`);
      }
    });
    
    setImportedProducts(products);
    setErrors(importErrors);
    setPreviewMode(true);
  };
  
  const processImport = async () => {
    if (importedProducts.length === 0) {
      setErrors(['Nenhum produto válido para importar']);
      return;
    }
    
    setIsImporting(true);
    
    try {
      // Process each product
      let successCount = 0;
      let errorCount = 0;
      
      for (const product of importedProducts) {
        try {
          // Find category ID
          const categoryObj = categories.find(c => 
            c.name.toLowerCase() === product.category.toLowerCase()
          );
          
          // Parse price - convert string to number
          const priceStr = product.price.replace(/[^\d.,]/g, '').replace(',', '.');
          const price = parseFloat(priceStr);
          
          if (!categoryObj || isNaN(price)) {
            errorCount++;
            continue;
          }
          
          // Parse subcategories if present
          const subcategoryValues: Record<string, string> = {};
          if (product.subcategories) {
            const subcatEntries = product.subcategories.split(';');
            subcatEntries.forEach(entry => {
              const [type, value] = entry.split(':');
              if (type && value) {
                subcategoryValues[type.trim()] = value.trim();
              }
            });
          }
          
          // Insert product into Supabase
          const { data: newProduct, error } = await supabase
            .from('products')
            .insert({
              name: product.name,
              description: product.description,
              price,
              category_id: categoryObj.id.toString(),
              subcategory_values: subcategoryValues,
              featured: product.featured,
              stock_quantity: product.stockQuantity
            })
            .select()
            .single();
            
          if (error) throw error;
          
          // Insert images if any
          if (product.images.length > 0) {
            const imageInserts = product.images.map((imageUrl, index) => ({
              product_id: newProduct.id,
              url: imageUrl,
              sort_order: index
            }));
            
            const { error: imageError } = await supabase
              .from('product_images')
              .insert(imageInserts);
              
            if (imageError) throw imageError;
          }
          
          successCount++;
        } catch (err) {
          console.error(`Error importing product ${product.name}:`, err);
          errorCount++;
        }
      }
      
      toast({
        title: `Importação concluída`,
        description: `${successCount} produtos importados com sucesso. ${errorCount} falhas.`,
      });
      
      setSuccess(true);
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Erro na importação",
        description: "Ocorreu um erro ao importar os produtos.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
      setFile(null);
      setImageFile(null);
      setParsedData([]);
      setHeaders([]);
      setMapping({});
      setPreviewMode(false);
      setImportedProducts([]);
    }
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <h2 className="text-2xl font-playfair font-semibold">Importação em massa de produtos</h2>
          
          {!previewMode && !success ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">1. Faça upload do arquivo CSV</h3>
                <p className="text-sm text-muted-foreground">
                  O arquivo CSV deve conter cabeçalhos para nome, preço, descrição, categoria, subcategorias e imagens.
                </p>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={handleCsvUpload}
                    className="w-full sm:w-auto"
                  />
                  {file && <p className="text-sm font-medium">{file.name}</p>}
                </div>
              </div>
              
              {headers.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">2. Mapeie as colunas CSV para campos de produto</h3>
                  <CsvColumnMapper 
                    headers={headers} 
                    mapping={mapping} 
                    setMapping={setMapping} 
                  />
                </div>
              )}
              
              {parsedData.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">3. Faça upload do arquivo ZIP com as imagens (opcional)</h3>
                  <p className="text-sm text-muted-foreground">
                    Se seus produtos usam imagens locais, faça upload do arquivo ZIP contendo todas as imagens.
                    Caso contrário, certifique-se que a coluna de imagens no CSV contenha URLs válidas.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <Input
                      type="file"
                      accept=".zip"
                      onChange={handleImageUpload}
                      className="w-full sm:w-auto"
                    />
                    {imageFile && <p className="text-sm font-medium">{imageFile.name}</p>}
                  </div>
                  
                  <div className="pt-4">
                    <Button onClick={previewImport}>
                      Pré-visualizar Importação
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : previewMode ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Pré-visualização da importação</h3>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setPreviewMode(false)}>
                    Voltar
                  </Button>
                  <Button onClick={processImport}>
                    <Upload className="mr-2 h-4 w-4" />
                    Confirmar Importação
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
          ) : (
            <div className="space-y-4 text-center py-8">
              <div className="flex justify-center">
                <div className="bg-green-100 p-4 rounded-full">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-medium">Importação concluída com sucesso!</h3>
              <p className="text-muted-foreground">Todos os produtos foram importados e estão disponíveis na loja.</p>
              <Button onClick={() => setSuccess(false)}>
                Realizar nova importação
              </Button>
            </div>
          )}
          
          {errors.length > 0 && !previewMode && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc pl-5 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="text-sm">{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CsvImporter;
