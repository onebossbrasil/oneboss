
import ModernCard from "./ModernCard";
import { Plus } from "lucide-react";

interface ManageCategoriesCardProps {
  onManageClick?: () => void;
}

const ManageCategoriesCard = ({ onManageClick }: ManageCategoriesCardProps) => (
  <ModernCard
    title="Gerenciar categorias"
    description="Adicione, edite ou exclua categorias para organizar seus produtos com facilidade."
    buttonLabel="Nova Categoria"
    onButtonClick={onManageClick}
    buttonIcon={<Plus />}
  />
);

export default ManageCategoriesCard;
