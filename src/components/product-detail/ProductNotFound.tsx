
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ProductNotFoundProps {
  error: string | null;
}

const ProductNotFound = ({ error }: ProductNotFoundProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-destructive mb-4">
            {error || "Produto não encontrado"}
          </h2>
          <p className="mb-6 text-muted-foreground">
            Não foi possível encontrar o produto solicitado.
          </p>
          <Link
            to="/loja"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
          >
            Voltar para a loja
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductNotFound;
