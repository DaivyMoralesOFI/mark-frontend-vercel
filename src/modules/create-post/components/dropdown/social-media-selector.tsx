import { Button } from "@/shared/components/ui/button";

import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/shared/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarImage,
  AvatarGroup,
} from "@/shared/components/ui/avatar";
import { platforms } from "@/modules/create-post/utils/definitions";

interface SocialMediaSelectorProps {
  value?: string[];
  onChange?: (value: string[]) => void;
}

const SocialMediaSelector = ({
  value = [platforms[0].id],
  onChange,
}: SocialMediaSelectorProps) => {
  const selectedPlatforms = platforms.filter((p) => value.includes(p.id));

  const togglePlatform = (platform: (typeof platforms)[0]) => {
    const isSelected = value.includes(platform.id);
    if (isSelected) {
      if (value.length === 1) return;
      onChange?.(value.filter((id) => id !== platform.id));
    } else {
      onChange?.([...value, platform.id]);
    }
  };

  const isPlatformSelected = (platformId: string) => {
    return value.includes(platformId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="group flex items-center gap-2 px-4 py-2.5 bg-surface-container-low/80 backdrop-blur-md hover:bg-surface-container border border-outline-variant/30 rounded-full"
        >
          {selectedPlatforms.length === 1 ? (
            <>
              <picture className="w-5 h-5 block relative p-0 m-0">
                <source
                  src={selectedPlatforms[0].logo_fill}
                  type="image/svg+xml"
                />
                <img
                  src={selectedPlatforms[0].logo_fill}
                  alt={selectedPlatforms[0].name}
                  className="aspect-square object-contain"
                />
              </picture>
              {selectedPlatforms[0].name}
            </>
          ) : (
            <>
              <AvatarGroup max={5} className="mr-1">
                {selectedPlatforms.map((platform) => (
                  <Avatar
                    key={platform.id}
                    className="w-5 h-5 border-1 border-background bg-surface p-0.5"
                  >
                    <AvatarImage
                      src={platform.logo_fill}
                      alt={platform.name}
                      className="aspect-square object-contain"
                    />
                  </Avatar>
                ))}
              </AvatarGroup>
              <span>{selectedPlatforms.length} chosen</span>
            </>
          )}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[99999] max-w-[150px]">
        <DropdownMenuGroup>
          {platforms.map((platform) => (
            <DropdownMenuCheckboxItem
              key={platform.id}
              checked={isPlatformSelected(platform.id)}
              onCheckedChange={() => togglePlatform(platform)}
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
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SocialMediaSelector;
