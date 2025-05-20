
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { User, Box, ArrowLeft, Users } from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const sidebarTabs = [
  { key: "produtos", label: "Produtos", icon: <Box className="h-5 w-5" /> },
  { key: "categorias", label: "Categorias", icon: <ArrowLeft className="h-5 w-5" /> },
  { key: "leads", label: "Leads", icon: <User className="h-5 w-5" /> },
  { key: "parceiros", label: "Parceiros", icon: <Users className="h-5 w-5" /> }, // Mantido como última opção
];

const AdminSidebar = ({ activeTab, onTabChange }: AdminSidebarProps) => {
  const { state } = useSidebar();

  return (
    <Sidebar
      className={`
        ${state === "collapsed" ? "w-14" : "w-56"}
        min-h-screen bg-[#F6F6F7] border-r border-gray-200
        flex-shrink-0
        pt-20 fixed left-0 top-0 z-30
        transition-all
      `}
      collapsible="icon"
    >
      <SidebarTrigger className="m-2 self-end" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Painel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarTabs.map(tab => (
                <SidebarMenuItem key={tab.key}>
                  <SidebarMenuButton
                    className={`w-full flex items-center font-medium ${activeTab === tab.key
                      ? "bg-gold/90 text-gray-900 font-bold shadow"
                      : "hover:bg-gold/10 text-gray-800"
                    }`}
                    onClick={() => onTabChange(tab.key)}
                  >
                    {tab.icon}
                    {state !== "collapsed" && <span className="ml-3">{tab.label}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
export default AdminSidebar;

