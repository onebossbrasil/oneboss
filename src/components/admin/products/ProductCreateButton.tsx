
import { Plus } from "lucide-react";

interface ProductCreateButtonProps {
  onClick: () => void;
  className?: string;
}

export default function ProductCreateButton({ onClick, className }: ProductCreateButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Cadastrar Produto"
      className={`bg-gold text-white rounded-full shadow-lg hover:bg-gold/90 transition-all flex items-center justify-center 
        w-12 h-12 md:w-12 md:h-12 fixed md:absolute z-30 top-[118px] right-6 md:top-[88px] md:right-10
        border-none outline-none focus:ring-2 focus:ring-gold/60 ${className || ""}`}
      style={{
        fontSize: 28,
        borderRadius: "9999px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.07)",
      }}
    >
      <Plus size={28} className="m-0 p-0" />
    </button>
  );
}
