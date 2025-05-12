
import { ChevronLeft } from "lucide-react";

interface BackButtonProps {
  onClick: () => void;
}

const BackButton = ({ onClick }: BackButtonProps) => {
  return (
    <button 
      onClick={onClick}
      className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
    >
      <ChevronLeft className="h-4 w-4 mr-1" />
      Voltar
    </button>
  );
};

export default BackButton;
