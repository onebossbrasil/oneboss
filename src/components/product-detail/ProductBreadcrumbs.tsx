
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Product } from "@/types/product";
import { useCategories } from "@/contexts/CategoryContext";

interface ProductBreadcrumbsProps {
  product: Product;
}

const ProductBreadcrumbs = ({ product }: ProductBreadcrumbsProps) => {
  const { categories } = useCategories();
  
  // Find the category for this product
  // Convert product.categoryId from string to number for comparison with category.id
  const categoryId = product.categoryId ? parseInt(product.categoryId) : null;
  const category = categories.find(cat => cat.id === categoryId);
  
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap text-sm">
        <li className="flex items-center">
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
        </li>
        <li className="flex items-center">
          <Link to="/loja" className="text-muted-foreground hover:text-foreground">
            Loja
          </Link>
          {category && (
            <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
          )}
        </li>
        {category && (
          <li className="flex items-center">
            <Link 
              to={`/loja?categoria=${category.value}`}
              className="text-muted-foreground hover:text-foreground"
            >
              {category.name}
            </Link>
            <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
          </li>
        )}
        <li className="font-medium text-foreground">
          {product.name}
        </li>
      </ol>
    </nav>
  );
};

export default ProductBreadcrumbs;
