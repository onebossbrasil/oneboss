
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ProductDetailSkeleton = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center p-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-xl text-muted-foreground">Carregando produto...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailSkeleton;
