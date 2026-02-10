import { Button } from "@/shared/components/ui/button";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { platforms } from "@/modules/creation-studio/types/content-type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

const SocialMediaSelector = () => {
  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState(platforms[0]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          onClick={() => setOpen(!open)}
          className="group flex items-center gap-2 px-4 py-2.5 bg-surface-container-low/80 backdrop-blur-md hover:bg-surface-container border border-outline-variant/30 rounded-full"
        >
          <picture className="w-5 h-5 block relative p-0 m-0">
            <source src={platform.logo_fill} type="image/svg+xml" />
            <img
              src={platform.logo_fill}
              alt={platform.name}
              className="aspect-square object-contain"
            />
          </picture>
          {platform.name} <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[99999] max-w-[150px]">
        <DropdownMenuGroup>
          {platforms.map((platform) => (
            <DropdownMenuItem
              key={platform.id}
              onClick={() => setPlatform(platform)}
              className=""
            >
              <picture className="w-5 h-5 block relative p-0 m-0">
                <source src={platform.logo_fill} type="image/svg+xml" />
                <img
                  src={platform.logo_fill}
                  alt={platform.name}
                  className="aspect-square object-contain"
                />
              </picture>
              {platform.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SocialMediaSelector;
