import { ReactNode } from "react";
import AdminSidebar from "./sidebar/AdminSidebar";
import AdminHeaderBar from "./AdminHeaderBar";
import AdminTabsNav from "./dashboard/AdminTabsNav";

interface AdminLayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (value: string) => void;
  onLogout: () => void;
}

export default function AdminLayout({
  children,
  activeTab,
  onTabChange,
  onLogout,
}: AdminLayoutProps) {
  // Handler para abrir o modal de cadastro se o sidebar disparar
  const [productListRef, setProductListRef] = React.useState<any>(null);

  return (
    <div className="flex flex-col bg-[#F1F1F1] w-full min-h-screen">
      <AdminHeaderBar onLogout={onLogout} />
      <div className="flex w-full min-h-screen">
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={onTabChange}
          // Passar função para ativar modal de cadastro se estiver na aba produtos
          onAddProduct={() => {
            // Tenta disparar no ProductList se ele estiver montado
            if (
              activeTab === "produtos" &&
              productListRef &&
              productListRef.handleCreate
            ) {
              productListRef.handleCreate();
            }
          }}
        />
        {/* Centralizar a sessão principal com padding igual nas laterais */}
        <div className="flex-1 min-h-screen flex flex-col items-center">
          <div className="w-full max-w-6xl px-6 md:px-24 pt-20 relative">
            <AdminTabsNav activeTab={activeTab} onTabChange={onTabChange} />
            <main className="w-full p-2 md:p-4">
              {/* Passa um ref/callback para o ProductList */}
              {React.cloneElement(
                Array.isArray(children) ? children[0] : children,
                { ref: setProductListRef }
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
