
import { ReactNode } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { User, LogOut, Grid2x2, Plus, Tag, Users, ArrowLeft } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface AdminLayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (value: string) => void;
  onLogout: () => void;
}

const tabs = [
  { key: "produtos", icon: Grid2x2, label: "Produtos" },
  { key: "importar", icon: Plus, label: "Importar" },
  { key: "categorias", icon: Tag, label: "Categorias" },
  { key: "leads", icon: Users, label: "Leads" },
];

export default function AdminLayout({ children, activeTab, onTabChange, onLogout }: AdminLayoutProps) {
  const { user } = useAuth();
  const { state } = useSidebar();

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
    <div className="min-h-screen w-full bg-gray-50 flex">
      {/* Sidebar fina, só ícones */}
      <Sidebar className="bg-gray-900 w-16 flex flex-col items-center py-6 space-y-6 border-r border-gray-200 fixed left-0 top-0 h-full z-40">
        <div className="flex flex-col items-center gap-6 w-full">
          {/* Logo */}
          <div className="flex items-center justify-center mb-2 select-none cursor-pointer h-10 w-10 rounded bg-gray-800">
            <span className="font-bold text-xl text-white">ob</span>
          </div>
          <SidebarMenu>
            {tabs.map((tab) => (
              <SidebarMenuItem key={tab.key} className="w-full flex justify-center">
                <SidebarMenuButton
                  className={`flex flex-col items-center justify-center h-12 w-12 rounded-lg transition-all ${
                    activeTab === tab.key
                      ? "bg-gray-700 text-gold"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                  onClick={() => onTabChange(tab.key)}
                  aria-label={tab.label}
                >
                  <tab.icon className="h-5 w-5" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
        {/* Avatar e logout ao fundo da sidebar */}
        <div className="flex flex-col items-center mt-auto pb-4">
          <Avatar className="mb-2 h-8 w-8">
            <AvatarImage src={avatarUrl} alt={user?.email || "Admin"} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="text-gray-400 hover:text-white mt-2 p-0"
            onClick={onLogout}
            aria-label="Sair"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </Sidebar>

      {/* Main content area */}
      <div className="flex-1 ml-16 flex flex-col min-h-screen">
        {/* Header fixo topo */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow flex items-center px-8 h-16">
          <span className="font-playfair text-2xl font-bold text-gray-900 tracking-wide">
            oneboss
          </span>
          <span className="ml-4 text-gray-400 text-base font-light">
            Painel Administrativo
          </span>
          {/* (Espaço para futuros botões ou busca) */}
        </header>
        {/* Conteúdo principal centralizado */}
        <main className="flex-1 p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
