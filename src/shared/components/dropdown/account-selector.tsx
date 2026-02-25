import { useState, useRef, useEffect } from "react";
import { ChevronDown, CirclePlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/shared/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useBrands } from "@/shared/hooks/useBrands";
import { cn } from "@/shared/utils/utils";

const AccountSelector = () => {
  const [_, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { brands, selectedBrand, selectBrand } = useBrands();
  const navigate = useNavigate();

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

  const handleAddNewBrand = () => {
    navigate("/brand-dna-extractor");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer group">
        <div className="avatar-content flex flex-row justify-center items-center gap-3 group-hover:shadow-lg group-hover:bg-muted transition-all duration-200 rounded-md">
          {selectedBrand && (
            <>
              <Avatar className="h-7 w-7 rounded-md">
                <AvatarImage
                  src={selectedBrand.logo}
                  alt={selectedBrand.name}
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
                key={brand.url}
                onClick={() => selectBrand(brand.url)}
                className={cn(
                  "cursor-pointer",
                  selectedBrand?.url === brand.url &&
                  "bg-primary/20 hover:bg-primary/50",
                )}
              >
                <Avatar className="h-7 w-7 rounded-md">
                  <AvatarImage
                    src={brand.logo}
                    alt={brand.name}
                  />
                </Avatar>
                <p>{brand.name}</p>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={handleAddNewBrand}
            className="cursor-pointer"
          >
            <CirclePlus strokeWidth={2} size={16} />
            <p>Add New Brand</p>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccountSelector;
