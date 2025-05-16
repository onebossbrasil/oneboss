
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { SidebarProvider } from "@/components/ui/sidebar";
import ProductList from "../products/ProductList";
import CategoryManager from "../CategoryManager";
import LeadsManager from "../LeadsManager";

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState("produtos");

  return (
    <SidebarProvider>
      <AdminLayout activeTab={activeTab} onTabChange={setActiveTab} onLogout={onLogout}>
        <div>
          {activeTab === "produtos" && <ProductList />}
          {activeTab === "categorias" && <CategoryManager />}
          {activeTab === "leads" && <LeadsManager />}
        </div>
      </AdminLayout>
    </SidebarProvider>
  );
};

export default AdminDashboard;
