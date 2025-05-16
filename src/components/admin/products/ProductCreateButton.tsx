
import { Plus } from "lucide-react";

interface ProductCreateButtonProps {
  onClick: () => void;
}

export default function ProductCreateButton({ onClick }: ProductCreateButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Cadastrar Produto"
      className="fixed z-30 bottom-8 right-6 md:static md:ml-auto md:mt-4 mb-3 bg-gold text-white rounded-full p-0 md:p-2 shadow-lg hover:bg-gold/90 transition-all flex items-center justify-center w-14 h-14 md:w-12 md:h-12"
      style={{
        position: 'fixed',
        bottom: 32,
        right: 24,
        backgroundColor: "#C9A227",
        color: "#fff",
        fontSize: 28,
        borderRadius: "9999px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.07)",
      }}
    >
      <Plus size={36} className="m-0 p-0" />
    </button>
  );
}
