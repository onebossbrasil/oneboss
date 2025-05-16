
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <header className="w-full bg-white border-b-2 border-gold shadow-sm fixed z-40 left-0 top-0 h-24 flex items-center px-8" style={{ paddingBottom: "1.2rem" }}>
      <div className="flex justify-between items-center w-full">
        {/* Apenas a logo (ajustada conforme solicitado) */}
        <img
          src="/lovable-uploads/2a698565-9407-42ad-b71a-64ed1cb69ddd.png"
          alt="OneBoss"
          className="h-14 w-auto"
        />
        <div className="flex gap-6 items-center">
          {/* E-mail maior */}
          <span className="text-right text-base md:text-lg text-gray-700 pr-2 font-semibold">
            {user?.email}
          </span>
          {/* Avatar maior */}
          <Avatar className="h-14 w-14">
            <AvatarImage src={avatarUrl} alt={user?.email || "Admin"} />
            <AvatarFallback className="text-xl">{avatarFallback}</AvatarFallback>
          </Avatar>
          <Button
            size="icon"
            variant="outline"
            title="Sair"
            onClick={onLogout}
            className="ml-2 hover:bg-gold/20 border-gold h-14 w-14"
          >
            <LogOut className="h-7 w-7 text-gold" />
          </Button>
        </div>
      </div>
    </header>
  );
};
export default AdminHeaderBar;
