import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useCategory } from "@/contexts/CategoryContext";
import { useProduct } from "@/contexts/product";
import { useLead } from "@/contexts/LeadContext";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const { categories } = useCategory();
  const { products, fetchProduct } = useProduct();
  const { createLead } = useLead();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
	const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (productId) {
      fetchProduct(productId)
        .then((fetchedProduct) => {
          setProduct(fetchedProduct);
        })
        .catch((error) => {
          console.error("Error fetching product:", error);
        });
    }
  }, [productId, fetchProduct]);

  useEffect(() => {
    if (product) {
      document.title = `Loja Premium - ${product.name}`;
    }
  }, [product]);

  if (!product) {
    return <div>Carregando...</div>;
  }

  const categoryPath = categories.find((cat) => cat.id === String(product.category_id));
  const subcategoryPath = categoryPath?.subcategories.find((sub) => sub.id === String(product.subcategory_id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone || !message) {
      toast({
        title: "Erro ao enviar mensagem!",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createLead({
        name,
        email,
        phone,
        message: `Interesse no produto: ${product.name}. Mensagem: ${message}`,
      });

      toast({
        title: "Mensagem enviada!",
        description: "Sua mensagem foi enviada com sucesso.",
      });

      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (error) {
      console.error("Erro ao criar lead:", error);
      toast({
        title: "Erro ao enviar mensagem!",
        description: "Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            {/* Product Navigation */}
            <div className="mb-8 text-sm">
              <Link to="/" className="text-muted-foreground hover:underline">
                Home
              </Link>
              <span className="mx-2 text-muted-foreground">/</span>
              <Link
                to={`/loja?categoria=${categoryPath?.slug}`}
                className="text-muted-foreground hover:underline"
              >
                {categoryPath?.name}
              </Link>
              <span className="mx-2 text-muted-foreground">/</span>
              {subcategoryPath && (
                <>
                  <Link
                    to={`/loja?categoria=${categoryPath?.slug}&subcategoria=${subcategoryPath.slug}`}
                    className="text-muted-foreground hover:underline"
                  >
                    {subcategoryPath?.name}
                  </Link>
                  <span className="mx-2 text-muted-foreground">/</span>
                </>
              )}
              <span className="text-foreground">{product.name}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Images */}
              <div>
                <AspectRatio ratio={16 / 9}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </AspectRatio>
                <div className="mt-4 flex -mx-2 overflow-x-auto">
                  {[product.image, product.image, product.image].map(
                    (
                      image,
                      index
                    ) => (
                      <div key={index} className="px-2 w-1/3 md:w-1/4">
                        <AspectRatio ratio={16 / 9}>
                          <img
                            src={image}
                            alt={`${product.name} - Alt ${index + 1}`}
                            className="w-full h-full object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity duration-200"
                          />
                        </AspectRatio>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Product Details */}
              <div>
                <h1 className="text-3xl font-semibold mb-4">{product.name}</h1>
                <div className="flex items-center mb-3">
                  <Badge className="mr-2">Novo</Badge>
                  <span className="text-sm text-muted-foreground">
                    {product.estoque} em estoque
                  </span>
                </div>
                <p className="text-lg font-medium text-gold mb-6">
                  R$ {product.price}
                </p>
                <div className="mb-6">
                  <h3 className="text-xl font-medium mb-2">Descrição</h3>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>

                {/* Quantity Selection */}
                <div className="flex items-center mb-6">
                  <Label htmlFor="quantity" className="mr-3">
                    Quantidade:
                  </Label>
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 px-2"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      id="quantity"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(parseInt(e.target.value, 10))
                      }
                      className="w-16 text-center focus-visible:outline-none focus-visible:ring-0 shadow-none"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 px-2"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button size="lg" className="w-full mb-4">
                  Adicionar ao Carrinho
                </Button>

                {/* Contact Form */}
                <div>
                  <h3 className="text-xl font-medium mb-4">
                    Entre em Contato
                  </h3>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="name">Nome</Label>
                        <Input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          type="tel"
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="message">Mensagem</Label>
                        <Textarea
                          id="message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={4}
                        />
                      </div>
                      <Button type="submit">Enviar Mensagem</Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
