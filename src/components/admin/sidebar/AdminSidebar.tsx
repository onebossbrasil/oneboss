import { Plus } from "lucide-react";
import React from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from "@/components/ui/sidebar";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  onAddProduct?: () => void;
}

const sidebarItems = [
  { key: "produtos", label: "Produtos" },
  { key: "categorias", label: "Categorias" },
  { key: "leads", label: "Leads" },
];

export default function AdminSidebar({ activeTab, onTabChange, onAddProduct }: AdminSidebarProps) {
  const { collapsed } = useSidebar();

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"} collapsible>
      <SidebarTrigger className="m-2 self-end" />
      <SidebarContent>
        <SidebarGroup defaultOpen>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map(item => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    asChild
                    onClick={() => onTabChange(item.key)}
                    className={
                      activeTab === item.key
                        ? "bg-muted text-primary font-medium"
                        : "hover:bg-muted/50"
                    }
                  >
                    <span>
                      {/* Mostre o label na versão expandida */}
                      {!collapsed && item.label}
                      {/* Mostre só a letra maiúscula na versão mini */}
                      {collapsed && item.label.slice(0, 1)}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {/* Botão Adicionar Produto */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={onAddProduct}
                  className="flex items-center gap-2 font-medium text-gold hover:bg-gold/10 py-2"
                  asChild={false}
                >
                  <>
                    <Plus size={18} /> {!collapsed && "Cadastrar Produto"}
                  </>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
