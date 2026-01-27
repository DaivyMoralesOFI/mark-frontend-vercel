import React, { useState, useRef, useEffect } from "react";
import {
  BadgeCheck,
  Bell,
  ChevronDown,
  CirclePlus,
  LogOut,
  Sparkles,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import OFILogo from "@/assets/logos/ofi-white.webp";

const AccountSelector = () => {
  const [_, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
        <div className="avatar-content flex flex-row justify-center items-center gap-3 group-hover:shadow-lg group-hover:bg-purple-100 transition-all duration-200 rounded-md">
          <Avatar className="h-7 w-7 rounded-md">
            <AvatarImage src={OFILogo} alt={"OFI"} />
          </Avatar>
          <ChevronDown className="" strokeWidth={2} size={10} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg text-on-surface"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Brand Selector</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Avatar className="h-7 w-7 rounded-md">
              <AvatarImage src={OFILogo} alt={"OFI"} />
            </Avatar>
            <p>OFI Testing Services</p>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <CirclePlus strokeWidth={2} size={16} />
            <p>Add New Brand</p>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccountSelector;
