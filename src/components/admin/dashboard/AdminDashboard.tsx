
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductList from "../products/ProductList";
import CategoryManager from "../CategoryManager";
import LeadsManager from "../LeadsManager";
import AdminPartnerManager from "../partners/AdminPartnerManager";
import { CategoryProvider } from "@/contexts/CategoryContext";
import { useIsMobile } from "@/hooks/useIsMobile";

interface AdminDashboardProps {
  onLogout: () => void;
}

const TABS = [
  { key: "produtos", label: "Produtos" },
  { key: "categorias", label: "Categorias" },
  { key: "leads", label: "Leads" },
  { key: "parceiros", label: "Parceiros" },
];

const LOCAL_STORAGE_KEY = "admin_dashboard_active_tab";

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  // Inicializa com o valor salvo ou "produtos"
  const [activeTab, setActiveTab] = useState(() => {
    const saved = typeof window !== "undefined"
      ? localStorage.getItem(LOCAL_STORAGE_KEY)
      : null;
    return saved && TABS.some(tab => tab.key === saved) ? saved : "produtos";
  });
  const isMobile = useIsMobile();

  // Salva o valor sempre que mudar (com proteção contra QuotaExceededError)
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, activeTab);
    } catch (error) {
      console.warn("Erro ao salvar tab ativa no localStorage:", error);
      // Em caso de quota excedida, limpa alguns itens e tenta novamente
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        try {
          localStorage.clear();
          localStorage.setItem(LOCAL_STORAGE_KEY, activeTab);
        } catch {
          // Se ainda assim falhar, ignora silenciosamente
        }
      }
    }
  }, [activeTab]);

  if (isMobile) {
    // MOBILE LAYOUT - wrap everything with providers
    return (
      <CategoryProvider>
          <div className="w-full min-h-screen bg-[#F1F1F1] flex flex-col">
            {/* Mobile Header */}
            <header className="bg-white border-b-2 border-gold flex items-center justify-between px-4 py-3 sticky top-0 z-40 shadow-sm">
              <img
                src="/lovable-uploads/cc202675-942c-4f4f-9e0c-0ba81e060e33.png"
                alt="OneBoss"
                className="h-8 w-auto"
              />
              <button
                onClick={onLogout}
                className="ml-2 rounded-full border border-gold bg-gold/10 text-gold px-3 py-2 text-xs font-semibold shadow hover:bg-gold/20"
              >
                Sair
              </button>
            </header>
            {/* Mobile Abas/Navegação */}
            <nav className="flex w-full border-b bg-[#fcf7ea]">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 px-4 py-2 text-sm font-semibold transition ${activeTab === tab.key
                    ? "border-b-2 border-gold text-gold bg-white shadow"
                    : "text-gray-600 hover:bg-gold/10"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
            <div className="flex-1 p-2">
              {activeTab === "produtos" && (
                <div className="w-full">
                  <ProductList />
                </div>
              )}
              {activeTab === "categorias" && (
                <CategoryManager />
              )}
              {activeTab === "leads" && (
                <LeadsManager />
              )}
              {activeTab === "parceiros" && (
                <AdminPartnerManager />
              )}
            </div>
          </div>
      </CategoryProvider>
    );
  }

  // DESKTOP LAYOUT - wrap everything with providers
  return (
    <SidebarProvider>
      <AdminLayout activeTab={activeTab} onTabChange={setActiveTab} onLogout={onLogout}>
        <CategoryProvider>
            <div>
              {activeTab === "produtos" && <ProductList />}
              {activeTab === "categorias" && <CategoryManager />}
              {activeTab === "leads" && <LeadsManager />}
              {activeTab === "parceiros" && <AdminPartnerManager />}
            </div>
        </CategoryProvider>
      </AdminLayout>
    </SidebarProvider>
  );
};

export default AdminDashboard;
