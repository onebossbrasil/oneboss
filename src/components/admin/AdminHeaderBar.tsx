
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface AdminHeaderBarProps {
  onLogout: () => void;
}

const AdminHeaderBar = ({ onLogout }: AdminHeaderBarProps) => {
  const { user } = useAuth();
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
    <header className="w-full bg-white border-b-2 border-gold shadow-sm fixed z-40 left-0 top-0 h-20 flex items-center px-8">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center">
          {/* LOGO - Agora clicável */}
          <Link to="/">
            <img
              src="/lovable-uploads/cc202675-942c-4f4f-9e0c-0ba81e060e33.png"
              alt="OneBoss"
              className="h-12 w-auto mr-0 cursor-pointer"
            />
          </Link>
          {/* Removido o texto OneBoss e Premium Panel */}
        </div>
        <div className="flex gap-4 items-center">
          <span className="text-right text-xs text-gray-500 pr-2">{user?.email}</span>
          <Avatar>
            <AvatarImage src={avatarUrl} alt={user?.email || "Admin"} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
          <Button
            size="icon"
            variant="outline"
            title="Sair"
            onClick={onLogout}
            className="ml-2 hover:bg-gold/20 border-gold"
          >
            <LogOut className="h-5 w-5 text-gold" />
          </Button>
        </div>
      </div>
    </header>
  );
};
export default AdminHeaderBar;
