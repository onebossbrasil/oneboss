
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
import { User, Box, ArrowLeft } from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const sidebarTabs = [
  { key: "produtos", label: "Produtos", icon: <Box className="h-5 w-5" /> },
  { key: "categorias", label: "Categorias", icon: <ArrowLeft className="h-5 w-5" /> },
  { key: "leads", label: "Leads", icon: <User className="h-5 w-5" /> },
];

const AdminSidebar = ({ activeTab, onTabChange }: AdminSidebarProps) => {
  const { state } = useSidebar();

  // Altera a largura: colapsado w-14->w-21 (56px->84px), aberto w-56->w-84 (224px->336px)
  const sidebarWidth = state === "collapsed" ? "w-21" : "w-84";
  // Classes utilitárias tailwind: w-21 (84px) e w-84 (336px) devem estar definidas via tailwind.config (funciona para w-[84px], w-[336px]).

  return (
    <Sidebar
      className={`
        ${sidebarWidth}
        min-h-screen bg-[#F6F6F7] border-r border-gray-200
        flex-shrink-0
        pt-24 fixed left-0 top-0 z-30
        transition-all
      `}
      collapsible="icon"
      style={{
        // Sobrescrita direta para garantir sem precisar editar tailwind.config.
        width: state === "collapsed" ? 84 : 336,
        minWidth: state === "collapsed" ? 84 : 336,
        maxWidth: state === "collapsed" ? 84 : 336,
      }}
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
