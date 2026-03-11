import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/shared/components/ui/DropdownMenu";
import {
  Avatar,
  AvatarImage,
  AvatarGroup,
} from "@/shared/components/ui/Avatar";
import { platforms } from "@/modules/creation-studio/utils/definitions";
import { cn } from "@/shared/utils/utils";

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
        <button
          type="button"
          className={cn(
            "group flex items-center gap-1.5 px-3 py-1.5 rounded-full",
            "text-xs font-medium transition-all duration-200",
            "bg-black/[0.05] dark:bg-white/[0.05] border border-black/[0.10] dark:border-white/[0.08] text-neutral-600 dark:text-neutral-300",
            "hover:bg-black/[0.08] dark:hover:bg-white/[0.09] hover:border-black/[0.15] dark:hover:border-white/[0.15] hover:text-neutral-900 dark:hover:text-white",
            "data-[state=open]:bg-black/[0.08] dark:data-[state=open]:bg-white/[0.09] data-[state=open]:border-black/[0.15] dark:data-[state=open]:border-white/[0.15] data-[state=open]:text-neutral-900 dark:data-[state=open]:text-white",
            "outline-none focus-visible:ring-2 focus-visible:ring-[#D946EF]/30"
          )}
        >
          <div className="flex items-center gap-1.5">
            {selectedPlatforms.length === 1 ? (
              <>
                <picture className="w-3.5 h-3.5 block relative flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                  <source
                    src={selectedPlatforms[0].logo_fill}
                    type="image/svg+xml"
                  />
                  <img
                    src={selectedPlatforms[0].logo_fill}
                    alt={selectedPlatforms[0].name}
                    className="w-full h-full object-contain"
                  />
                </picture>
                <span className="max-w-[80px] truncate">{selectedPlatforms[0].name}</span>
              </>
            ) : (
              <>
                <AvatarGroup max={4}>
                  {selectedPlatforms.map((platform) => (
                    <Avatar
                      key={platform.id}
                      className="w-4.5 h-4.5 border border-surface-container-lowest bg-surface-container-lowest p-0.5"
                    >
                      <AvatarImage
                        src={platform.logo_fill}
                        alt={platform.name}
                        className="w-full h-full object-contain"
                      />
                    </Avatar>
                  ))}
                </AvatarGroup>
                <span className="ml-0.5 tabular-nums">{selectedPlatforms.length}</span>
              </>
            )}
          </div>
          <ChevronDown className="w-3 h-3 opacity-40 group-hover:opacity-70 transition-all duration-200 group-data-[state=open]:rotate-180" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="z-[99999] min-w-[200px] p-1"
        align="start"
        sideOffset={8}
      >
        <div className="px-2.5 py-1.5 mb-0.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
            Platforms
          </span>
        </div>
        <DropdownMenuGroup>
          {platforms.map((platform) => {
            const isSelected = isPlatformSelected(platform.id);
            return (
              <DropdownMenuCheckboxItem
                key={platform.id}
                checked={isSelected}
                onCheckedChange={() => togglePlatform(platform)}
                className={cn(
                  "flex items-center gap-2.5 py-2 cursor-pointer rounded-lg mx-0.5 my-px",
                  "text-xs font-medium transition-colors duration-150",
                  isSelected
                    ? "bg-[#D946EF]/10 text-[#D946EF] focus:bg-[#D946EF]/15"
                    : "text-neutral-700 dark:text-neutral-300"
                )}
              >
                <div className={cn(
                  "w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 transition-colors",
                  isSelected
                    ? "bg-[#D946EF]/15"
                    : "bg-black/[0.05] dark:bg-white/[0.05]"
                )}>
                  <picture className="w-3.5 h-3.5 block relative p-0 m-0">
                    <source src={platform.logo_fill} type="image/svg+xml" />
                    <img
                      src={platform.logo_fill}
                      alt={platform.name}
                      className="w-full h-full object-contain"
                    />
                  </picture>
                </div>
                <span className="flex-1 truncate">{platform.name}</span>
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SocialMediaSelector;
