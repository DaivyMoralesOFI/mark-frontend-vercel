import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Button } from "@/shared/components/ui/button";
import { ChevronDown } from "lucide-react";
import { postTone } from "@/modules/creation-studio/utils/definitions";

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
        <Button
          variant="outline"
          className="group flex items-center gap-2 px-4 py-2.5 bg-surface-container-low/80 backdrop-blur-md hover:bg-surface-container border border-outline-variant/30 rounded-full"
        >
          <selectedTone.icon className="w-5 h-5 mr-2" />
          {selectedTone.label} <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[99999] max-w-[150px]">
        <DropdownMenuGroup>
          {postTone.map((tone) => (
            <DropdownMenuItem
              key={tone.value}
              onClick={() => handleSelect(tone)}
              className=""
            >
              <tone.icon className="w-4 h-4 mr-2" />
              {tone.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default PostToneSelector;
