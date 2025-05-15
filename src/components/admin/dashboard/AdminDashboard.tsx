
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
// import { ProductProvider } from "@/contexts/ProductContext"; // ProductProvider não é usado diretamente aqui.
import AdminLayout from "@/components/admin/AdminLayout";
import DesktopTabs from "./DesktopTabs";
import MobileContent from "./MobileContent";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminHeader from "./AdminHeader";
// import AdminDebugPanel from "../AdminDebugPanel"; // Removido

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const { toast } = useToast(); // toast não está sendo usado, mas pode ser mantido para uso futuro.
  const [activeTab, setActiveTab] = useState("produtos");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // mobileMenuOpen não está sendo usado, mas pode ser mantido.

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setMobileMenuOpen(false); // Garante que o menu feche ao trocar de aba no mobile, se aplicável.
  };

  return (
    <>
      <AdminHeader />
      {/* Painel de debug foi removido */}
      {/* <AdminDebugPanel /> */}
      <div className="pt-24 w-full max-w-full">
        <SidebarProvider>
          <AdminLayout activeTab={activeTab} onTabChange={handleTabChange} onLogout={onLogout}>
            <div className="hidden lg:block">
              <DesktopTabs activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            <div className="lg:hidden">
              <MobileContent activeTab={activeTab} />
            </div>
          </AdminLayout>
        </SidebarProvider>
      </div>
    </>
  );
};

export default AdminDashboard;
