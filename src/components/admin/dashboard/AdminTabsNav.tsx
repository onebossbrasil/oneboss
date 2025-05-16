
import React from "react";
import { cn } from "@/lib/utils";

interface AdminTabsNavProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const TABS = [
  { key: "produtos", label: "Produtos" },
  { key: "categorias", label: "Categorias" },
  { key: "leads", label: "Leads" },
];

function AdminTabsNav({ activeTab, onTabChange }: AdminTabsNavProps) {
  return (
    <nav
      className="w-full flex items-center py-3 px-4 bg-[#F1F1F1] border-b border-gray-200 sticky top-20 z-30"
      style={{ minHeight: 56 }}
    >
      <div className="flex mx-auto gap-2">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={cn(
              "flex-1 px-5 py-2 rounded-t-md text-lg font-medium transition-colors duration-100",
              activeTab === tab.key
                ? "bg-white border-b-2 border-gold text-gold shadow"
                : "hover:bg-gray-200 text-gray-600"
            )}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default AdminTabsNav;
