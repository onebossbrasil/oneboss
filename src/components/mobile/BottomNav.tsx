import { Home, Store, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      id: "home",
      label: "Início",
      icon: Home,
      path: "/",
      isActive: location.pathname === "/",
    },
    {
      id: "store",
      label: "Loja",
      icon: Store,
      path: "/loja",
      isActive: location.pathname.startsWith("/loja"),
    },
    {
      id: "profile",
      label: "Perfil",
      icon: User,
      path: "/perfil",
      isActive: location.pathname.startsWith("/perfil"),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glassmorphism border-t border-white/20 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                tab.isActive
                  ? "text-gold"
                  : "text-black hover:text-gold/70"
              )}
            >
              <Icon
                className={cn(
                  "w-6 h-6 transition-transform",
                  tab.isActive && "scale-110"
                )}
              />
              <span
                className={cn(
                  "text-xs font-medium",
                  tab.isActive && "font-semibold"
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
