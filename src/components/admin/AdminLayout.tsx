
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
        {/* Sessão principal */}
        <div className="flex-1 min-h-screen pl-14 md:pl-56 pt-20">
          <AdminTabsNav activeTab={activeTab} onTabChange={onTabChange} />
          <main className="flex-1 w-full max-w-full p-2 md:p-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
