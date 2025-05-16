
import React from "react";
import { Eye, EyeOff } from "lucide-react";

interface ProductVisibilityButtonProps {
  published: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const ProductVisibilityButton: React.FC<ProductVisibilityButtonProps> = ({
  published,
  onClick,
  disabled,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={published ? "Ocultar produto" : "Publicar produto"}
      aria-label={published ? "Ocultar produto" : "Publicar produto"}
      className={`inline-flex items-center justify-center rounded-full border p-2 transition
        ${published 
          ? "bg-[#FFF8E1] border-[#C9A227] hover:bg-[#F1DF97] shadow-sm" 
          : "bg-white border-gray-300 hover:bg-gray-100"} 
        `}
    >
      {published ? (
        <Eye
          className="h-5 w-5"
          color="#C9A227"
          strokeWidth={2.4}
        />
      ) : (
        <EyeOff
          className="h-5 w-5"
          color="#8E9196"
          strokeWidth={2.2}
        />
      )}
    </button>
  );
};

export default ProductVisibilityButton;
