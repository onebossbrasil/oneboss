
import React, { ReactNode } from "react";
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
  const [productListRef, setProductListRef] = React.useState<any>(null);

  return (
    <div className="flex flex-col bg-[#F1F1F1] w-full min-h-screen">
      <AdminHeaderBar onLogout={onLogout} />
      <div className="flex w-full min-h-screen">
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={onTabChange}
          onAddProduct={() => {
            if (
              activeTab === "produtos" &&
              productListRef &&
              productListRef.handleCreate
            ) {
              productListRef.handleCreate();
            }
          }}
        />
        <div className="flex-1 min-h-screen flex flex-col items-center">
          <div className="w-full max-w-6xl px-6 md:px-24 pt-20 relative">
            <AdminTabsNav activeTab={activeTab} onTabChange={onTabChange} />
            <main className="w-full p-2 md:p-4">
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
