
import ModernCard from "./ModernCard";
import { Plus } from "lucide-react";

interface ImportProductsCardProps {
  onImportClick?: () => void;
}

const ImportProductsCard = ({ onImportClick }: ImportProductsCardProps) => (
  <ModernCard
    title="Importar novos produtos"
    description="Faça upload de arquivos CSV para importar produtos rapidamente em massa."
    buttonLabel="Importar Produtos"
    onButtonClick={onImportClick}
    buttonIcon={<Plus />}
  />
);

export default ImportProductsCard;
