import { ShoppingCart, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  showCart?: boolean;
  cartCount?: number;
}

const MobileHeader = ({
  title,
  showBack = false,
  showCart = true,
  cartCount = 0,
}: MobileHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left side */}
        <div className="flex items-center gap-2 flex-1">
          {showBack ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : null}

          {title ? (
            <h1 className="text-lg font-semibold truncate">{title}</h1>
          ) : (
            <div className="flex items-center gap-2">
              <img
                src="/logo.svg"
                alt="OneBoss"
                className="h-8 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <span className="text-lg font-bold text-primary">OneBoss</span>
            </div>
          )}
        </div>

        {/* Right side */}
        {showCart && (
          <Button
            variant="ghost"
            size="icon"
            className="relative shrink-0"
            onClick={() => {
              // TODO: Implementar carrinho
              console.log("Abrir carrinho");
            }}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Button>
        )}
      </div>
    </header>
  );
};

export default MobileHeader;
