
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ProductProvider } from "@/contexts/ProductContext";
import AdminLayout from "@/components/admin/AdminLayout";
import DesktopTabs from "./DesktopTabs";
import MobileContent from "./MobileContent";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminHeader from "./AdminHeader";

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("produtos");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <AdminHeader />
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
