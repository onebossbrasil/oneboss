
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
        {/* Sessão principal centralizada */}
        <div className="flex-1 min-h-screen pl-[88px] md:pl-[350px] pt-32 flex flex-col items-center">
          {/* pt-32 ajusta padding-top extra para header aumentado, pl-[350px] sidebar maior */}
          <AdminTabsNav activeTab={activeTab} onTabChange={onTabChange} />
          <main className="flex flex-col items-center w-full max-w-5xl p-2 md:p-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
