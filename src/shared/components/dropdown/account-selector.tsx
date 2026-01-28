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
import { useBrands } from "@/core/hooks/useBrands";
import { cn } from "@/core/lib/utils";

const AccountSelector = () => {
  const [_, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { brands, loading, error, selectedBrand, selectBrand } = useBrands();
  console.log({ brands, loading, error });
  console.log({ selectedBrand });

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
          {selectedBrand && (
            <>
              <Avatar className="h-7 w-7 rounded-md">
                <AvatarImage
                  src={selectedBrand.identity.logo_url}
                  alt={selectedBrand.identity.name}
                />
              </Avatar>
              <ChevronDown className="" strokeWidth={2} size={10} />
            </>
          )}
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
          {brands?.map((brand) => {
            return (
              <DropdownMenuItem
                className={cn(
                  brand.isActive && "bg-primary/20 hover:bg-primary/50",
                )}
              >
                <Avatar className="h-7 w-7 rounded-md">
                  <AvatarImage
                    src={brand.identity.logo_url}
                    alt={brand.identity.name}
                  />
                </Avatar>
                <p>{brand.identity.name}</p>
              </DropdownMenuItem>
            );
          })}
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
