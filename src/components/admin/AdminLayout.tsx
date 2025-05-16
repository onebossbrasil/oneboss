
import { ReactNode } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { User, LogOut, ArrowRight, ArrowLeft, Trash2, ArrowUp } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

interface AdminLayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (value: string) => void;
  onLogout: () => void;
}

const tabs = [
  { key: "produtos", label: "Gerenciar Produtos", icon: "box" },
  { key: "importar", label: "Importar Produtos", icon: "arrow-up" },
  { key: "categorias", label: "Gerenciar Categorias", icon: "arrow-right" },
  { key: "leads", label: "Gerenciar Leads", icon: "user" },
];

const getTabIcon = (key: string) => {
  switch (key) {
    case "produtos":
      return <ArrowRight className="h-4 w-4" />;
    case "importar":
      return <ArrowUp className="h-4 w-4" />;
    case "categorias":
      return <ArrowLeft className="h-4 w-4" />;
    case "leads":
      return <User className="h-4 w-4" />;
    default:
      return <User className="h-4 w-4" />;
  }
};

export default function AdminLayout({
  children,
  activeTab,
  onTabChange,
  onLogout,
}: AdminLayoutProps) {
  const { user } = useAuth();
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();

  // Extra robustness for avatar fetch
  const avatarUrl =
    (user as any)?.avatar_url ||
    (user as any)?.user_metadata?.avatar_url ||
    undefined;
  const avatarFallback =
    user?.email?.[0]?.toUpperCase() ||
    (user?.user_metadata?.name
      ? user.user_metadata.name[0]?.toUpperCase()
      : "A");

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900 w-full max-w-full">
      {/* Sidebar */}
      <Sidebar
        className={`${
          // Sidebar largura responsiva: fixa no desktop e overlay/colapsável no mobile
          state === "collapsed"
            ? "w-14"
            : "w-56"
        } md:relative md:h-auto h-auto`}
        collapsible="icon"
      >
        <SidebarTrigger className="m-2 self-end" />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Painel</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {tabs.map((tab) => (
                  <SidebarMenuItem key={tab.key}>
                    <SidebarMenuButton
                      className={`w-full flex items-center ${
                        activeTab === tab.key
                          ? "bg-muted text-primary font-bold"
                          : "hover:bg-muted/70"
                      }`}
                      onClick={() => onTabChange(tab.key)}
                    >
                      {getTabIcon(tab.key)}
                      {state !== "collapsed" && <span>{tab.label}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <div className="mt-10 px-4 flex flex-col items-center">
            <Avatar className="mb-2">
              <AvatarImage src={avatarUrl} alt={user?.email || "Admin"} />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
            <div className="text-xs text-muted-foreground break-all text-center">
              {user?.email || "Sem usuário"}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full"
              onClick={onLogout}
            >
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
          </div>
        </SidebarContent>
      </Sidebar>

      {/* Conteúdo principal: responsivo para ocupar todo espaço em telas menores */}
      <main className="flex-1 p-2 md:p-4 w-full max-w-full">{children}</main>
    </div>
  );
}
