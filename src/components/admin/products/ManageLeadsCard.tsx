
import ModernCard from "./ModernCard";
import { Plus } from "lucide-react";

interface ManageLeadsCardProps {
  onManageClick?: () => void;
}

const ManageLeadsCard = ({ onManageClick }: ManageLeadsCardProps) => (
  <ModernCard
    title="Gerenciar leads"
    description="Acompanhe e gerencie todos os leads recebidos pelo seu site de forma organizada."
    buttonLabel="Novo Lead"
    onButtonClick={onManageClick}
    buttonIcon={<Plus />}
  />
);

export default ManageLeadsCard;
