
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ProductProvider } from "@/contexts/ProductContext";
import MobileHeader from "./MobileHeader";
import DesktopHeader from "./DesktopHeader";
import MobileContent from "./MobileContent";
import DesktopTabs from "./DesktopTabs";

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("produtos");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    toast({
      title: "Logout realizado",
      description: "Você saiu do painel administrativo.",
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setMobileMenuOpen(false); // Close mobile menu when tab changes
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col w-full">
      {/* Mobile Header */}
      <MobileHeader 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        handleLogout={handleLogout}
      />

      {/* Desktop Header */}
      <DesktopHeader handleLogout={handleLogout} />

      <div className="flex-1 p-4">
        {/* Desktop Tabs */}
        <div className="hidden lg:block">
          <DesktopTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Mobile Content */}
        <div className="lg:hidden">
          <MobileContent activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
