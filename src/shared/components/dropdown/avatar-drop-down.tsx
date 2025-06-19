import React, { useState, useRef, useEffect } from "react";
import { BadgeCheck, Bell, ChevronDown, LogOut, Sparkles } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface AvatarDropdownProps {
  avatarSrc: string;
  userName?: string;
  userEmail?: string;
  onSignOut?: () => void;
}

const AvatarDropdown: React.FC<AvatarDropdownProps> = ({
  avatarSrc,
  userName = "Usuario",
  userEmail = "usuario@ejemplo.com",
  onSignOut,
}) => {
  const [_, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    if (onSignOut) onSignOut();
    setIsOpen(false);
    navigate("/auth");
  };

  // Cerrar el dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer group">
        <div className="avatar-content flex flex-row justify-center items-center gap-0 group-hover:shadow-lg group-hover:bg-purple-100 transition-all duration-200 rounded-md">
          <Avatar className="h-7 w-7 rounded-md">
            <AvatarImage src={avatarSrc} alt={userName} />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <ChevronDown className="mt-2" strokeWidth={2} size={10} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg text-on-surface"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={avatarSrc} alt={userName} />
              <AvatarFallback className="rounded-lg">{userName}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{userName}</span>
              <span className="truncate text-xs">{userEmail}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="">
            <Sparkles size={16} strokeWidth={1.5} />
            Upgrade to Pro
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheck size={16} strokeWidth={1.5} />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell size={16} strokeWidth={1.5} />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut size={16} strokeWidth={1.5} />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarDropdown;
