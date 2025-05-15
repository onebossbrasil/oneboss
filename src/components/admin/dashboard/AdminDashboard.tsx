
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ProductProvider } from "@/contexts/ProductContext";
import AdminLayout from "@/components/admin/AdminLayout";
import DesktopTabs from "./DesktopTabs";
import MobileContent from "./MobileContent";

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("produtos");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setMobileMenuOpen(false); // Fecha menu mobile ao trocar de aba
  };

  return (
    <AdminLayout activeTab={activeTab} onTabChange={handleTabChange} onLogout={onLogout}>
      {/* Versão desktop */}
      <div className="hidden lg:block">
        <DesktopTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      {/* Versão mobile */}
      <div className="lg:hidden">
        <MobileContent activeTab={activeTab} />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
