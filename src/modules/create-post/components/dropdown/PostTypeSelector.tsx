import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/shared/components/ui/DropdownMenu";
import { Button } from "@/shared/components/ui/Button";
import { ChevronDown } from "lucide-react";
import { postType } from "@/modules/create-post/utils/definitions";

interface PostTypeSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
}

const PostTypeSelector = ({ value, onChange }: PostTypeSelectorProps) => {
  const selectedType = postType.find((t) => t.value === value) ?? postType[0];

  const handleSelect = (type: (typeof postType)[0]) => {
    onChange?.(type.value);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="group flex items-center gap-2 px-4 py-2.5 bg-surface-container-low/80 backdrop-blur-md hover:bg-surface-container border border-outline-variant/30 rounded-full"
        >
          <selectedType.icon className="w-5 h-5 mr-2" />
          {selectedType.label} <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[99999] max-w-[150px]">
        <DropdownMenuGroup>
          {postType.map((type) => (
            <DropdownMenuItem
              key={type.value}
              onClick={() => handleSelect(type)}
              className=""
            >
              <type.icon className="w-4 h-4 mr-2" />
              {type.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default PostTypeSelector;
