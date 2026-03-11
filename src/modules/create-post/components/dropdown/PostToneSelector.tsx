import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/shared/components/ui/DropdownMenu";
import { ChevronDown, Check } from "lucide-react";
import { postTone } from "@/modules/create-post/utils/definitions";
import { cn } from "@/shared/utils/utils";

interface PostToneSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
}

const PostToneSelector = ({ value, onChange }: PostToneSelectorProps) => {
  const selectedTone = postTone.find((t) => t.value === value) ?? postTone[0];

  const handleSelect = (tone: (typeof postTone)[0]) => {
    onChange?.(tone.value);
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
          <selectedTone.icon className="w-3.5 h-3.5 flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" strokeWidth={1.8} />
          <span className="max-w-[80px] truncate">{selectedTone.label}</span>
          <ChevronDown className="w-3 h-3 opacity-40 group-hover:opacity-70 transition-all duration-200 group-data-[state=open]:rotate-180" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="z-[99999] min-w-[180px] p-1"
        align="start"
        sideOffset={8}
      >
        <div className="px-2.5 py-1.5 mb-0.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
            Post Tone
          </span>
        </div>
        <DropdownMenuGroup>
          {postTone.map((tone) => {
            const isSelected = tone.value === selectedTone.value;
            return (
              <DropdownMenuItem
                key={tone.value}
                onClick={() => handleSelect(tone)}
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-2 cursor-pointer rounded-lg mx-0.5 my-px",
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
                  <tone.icon className="w-3.5 h-3.5" strokeWidth={1.8} />
                </div>
                <span className="flex-1 truncate">{tone.label}</span>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default PostToneSelector;
