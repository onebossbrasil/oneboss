import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ProductProvider } from "@/contexts/ProductContext";
import AdminLayout from "@/components/admin/AdminLayout";
import DesktopTabs from "./DesktopTabs";
import MobileContent from "./MobileContent";
import { SidebarProvider } from "@/components/ui/sidebar";

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
    <SidebarProvider>
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
    </SidebarProvider>
  );
};

export default AdminDashboard;
