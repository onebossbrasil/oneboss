
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

export default function AdminLayout({ children, activeTab, onTabChange, onLogout }: AdminLayoutProps) {
  const { user } = useAuth();
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();

  // Avatar e fallback
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
    <div className="min-h-screen flex w-full bg-gray-100">
      {/* Sidebar SEM padding próprio, colada à esquerda */}
      <Sidebar className={`${state === "collapsed" ? "w-14" : "w-56"} bg-gray-900 border-r border-gray-300`} collapsible="icon">
        <SidebarTrigger className="m-2 self-end" />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              {/* Peq. Logo OneBoss acima do menu */}
              <div className="flex items-center gap-2 py-4 px-2">
                {/* Trocar para <img src=... /> se quiser usar imagem */}
                <span className="font-bold text-lg text-white tracking-wide">oneboss</span>
              </div>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {tabs.map((tab) => (
                  <SidebarMenuItem key={tab.key}>
                    <SidebarMenuButton
                      className={`w-full flex items-center gap-2 px-2 py-2 rounded transition ${
                        activeTab === tab.key
                          ? "bg-gray-800 text-white font-bold"
                          : "hover:bg-gray-700 text-gray-200"
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

          <div className="mt-auto mb-4 px-4 flex flex-col items-center">
            <Avatar className="mb-2">
              <AvatarImage src={avatarUrl} alt={user?.email || "Admin"} />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
            <div className="text-xs text-gray-300 break-all text-center">
              {user?.email || "Sem usuário"}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full border-gray-600 text-gray-400 hover:bg-gray-700"
              onClick={onLogout}
            >
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
          </div>
        </SidebarContent>
      </Sidebar>

      {/* WRAPPER do conteúdo principal */}
      <div className="flex-1 min-h-screen flex flex-col bg-gray-50">
        {/* HEADER */}
        <header className="h-20 flex items-center border-b border-gray-200 px-8 py-4 bg-gray-100 shadow-sm">
          {/* Logo à esquerda + espaço para ações no futuro */}
          <div className="flex items-center">
            {/* Use img se desejar, ou apenas texto, como abaixo */}
            <span className="font-playfair text-2xl font-bold text-gray-800 tracking-wide">oneboss</span>
            <span className="ml-4 text-gray-400 text-base font-light">Painel Administrativo</span>
          </div>
          {/* Futuro espaço para actions... */}
        </header>
        {/* CONTEÚDO PRINCIPAL, padding lateral esquerdo para separar da sidebar */}
        <main className="flex-1 max-w-6xl mx-auto w-full py-8 px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
