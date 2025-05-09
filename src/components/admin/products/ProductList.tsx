
import { useState } from "react";
import { Eye, EyeOff, Edit } from "lucide-react";
import { useProducts } from "@/contexts/ProductContext";
import { Product } from "@/types/product";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import ProductDetailsForm from "./ProductDetailsForm";
import CategorySelector from "./CategorySelector";
import ImageUpload from "./ImageUpload";
import { useToast } from "@/hooks/use-toast";

export default function ProductList() {
  const { products, updateProduct } = useProducts();
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategoryValues, setSubcategoryValues] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "1",
    featured: false
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stockQuantity: product.stockQuantity.toString(),
      featured: product.featured
    });
    setSelectedCategory(product.categoryId || "");
    setSubcategoryValues(product.subcategoryValues || {});
    setImagePreviewUrls(product.images.map(img => img.url));
    setImages([]);
    setDialogOpen(true);
  };

  const handleVisibilityToggle = async (product: Product) => {
    try {
      await updateProduct(product.id, {
        ...product,
        featured: !product.featured
      });
      
      toast({
        title: product.featured ? "Produto ocultado" : "Produto destacado",
        description: `${product.name} ${product.featured ? "não será exibido" : "será exibido"} na loja.`
      });
    } catch (error) {
      console.error("Error toggling product visibility:", error);
    }
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSubcategoryValues({});
  };
  
  const handleSubcategoryChange = (type: string, value: string) => {
    setSubcategoryValues(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // Create preview URLs
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      
      setImages(prev => [...prev, ...newFiles]);
      setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };
  
  const handleRemoveImage = (index: number) => {
    // Remove image and its preview
    const newImages = [...images];
    const newPreviewUrls = [...imagePreviewUrls];
    
    // Revoke the URL to free memory if it's a newly added image
    if (index >= (selectedProduct?.images.length || 0)) {
      URL.revokeObjectURL(newPreviewUrls[index]);
    }
    
    newImages.splice(index - (selectedProduct?.images.length || 0), 1);
    newPreviewUrls.splice(index, 1);
    
    setImages(newImages);
    setImagePreviewUrls(newPreviewUrls);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct) return;
    
    try {
      // Validate form data
      if (!formData.name || !formData.price || !selectedCategory) {
        toast({
          title: "Erro no formulário",
          description: "Por favor, preencha todos os campos obrigatórios.",
          variant: "destructive"
        });
        return;
      }
      
      // Convert price to a number
      const price = parseFloat(formData.price.replace(/[^\d,.-]/g, '').replace(',', '.'));
      if (isNaN(price)) {
        toast({
          title: "Preço inválido",
          description: "Por favor, insira um preço válido.",
          variant: "destructive"
        });
        return;
      }
      
      // Convert stock quantity to a number
      const stockQuantity = parseInt(formData.stockQuantity, 10);
      if (isNaN(stockQuantity)) {
        toast({
          title: "Quantidade inválida",
          description: "Por favor, insira uma quantidade válida.",
          variant: "destructive"
        });
        return;
      }

      // Prepare product data
      const productData = {
        name: formData.name,
        description: formData.description,
        price,
        categoryId: selectedCategory,
        subcategoryValues,
        featured: formData.featured,
        stockQuantity
      };
      
      // Update product
      await updateProduct(selectedProduct.id, productData, images.length > 0 ? images : undefined);
      
      // Close dialog
      setDialogOpen(false);
      
      // Clear form
      setSelectedProduct(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        stockQuantity: "1",
        featured: false
      });
      setSelectedCategory("");
      setSubcategoryValues({});
      setImages([]);
      setImagePreviewUrls([]);
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Erro ao atualizar produto",
        description: "Ocorreu um erro ao atualizar o produto. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4">Produtos Cadastrados</h3>
      
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Imagem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead className="text-center">Exibido</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                  Nenhum produto cadastrado
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.images.length > 0 ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
                        Sem imagem
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(product.price)}
                  </TableCell>
                  <TableCell>{product.stockQuantity}</TableCell>
                  <TableCell className="text-center">
                    {product.featured ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Sim
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Não
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleVisibilityToggle(product)}
                        title={product.featured ? "Ocultar produto" : "Exibir produto"}
                      >
                        {product.featured ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditClick(product)}
                        title="Editar produto"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleUpdateProduct} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <ProductDetailsForm 
                  formData={formData}
                  onChange={handleFormChange}
                />
                
                <CategorySelector
                  selectedCategory={selectedCategory}
                  subcategoryValues={subcategoryValues}
                  onCategoryChange={handleCategoryChange}
                  onSubcategoryChange={handleSubcategoryChange}
                />
              </div>
              
              <div className="space-y-4">
                <ImageUpload
                  images={images}
                  imagePreviewUrls={imagePreviewUrls}
                  handleImageChange={handleImageChange}
                  handleRemoveImage={handleRemoveImage}
                  existingImages={selectedProduct?.images || []}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Salvar Alterações
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
