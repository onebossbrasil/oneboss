
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductList from "../products/ProductList";
import CategoryManager from "../CategoryManager";
import LeadsManager from "../LeadsManager";
import { ProductProvider } from "@/contexts/product"; // Ensure correct import

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState("produtos");

  return (
    <SidebarProvider>
      <AdminLayout activeTab={activeTab} onTabChange={setActiveTab} onLogout={onLogout}>
        {/* Wrap the tab content in ProductProvider for proper context */}
        <ProductProvider>
          <div>
            {activeTab === "produtos" && <ProductList />}
            {activeTab === "categorias" && <CategoryManager />}
            {activeTab === "leads" && <LeadsManager />}
          </div>
        </ProductProvider>
      </AdminLayout>
    </SidebarProvider>
  );
};

export default AdminDashboard;
