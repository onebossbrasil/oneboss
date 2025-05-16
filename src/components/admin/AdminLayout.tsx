
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
  return (
    <div className="flex flex-col bg-[#F1F1F1] w-full min-h-screen">
      <AdminHeaderBar onLogout={onLogout} />
      <div className="flex w-full min-h-screen">
        <AdminSidebar activeTab={activeTab} onTabChange={onTabChange} />
        {/* Sessão principal ajustada: menos margem lateral, mais largura */}
        <div className="flex-1 min-h-screen pl-10 md:pl-24 pt-20 flex flex-col items-center">
          {/* Centralizar o menu de abas e conteúdo na página */}
          <div className="w-full max-w-6xl px-2 md:px-6">
            <AdminTabsNav activeTab={activeTab} onTabChange={onTabChange} />
            <main className="w-full p-2 md:p-4">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

