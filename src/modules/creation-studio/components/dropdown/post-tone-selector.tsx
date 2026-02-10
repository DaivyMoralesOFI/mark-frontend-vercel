import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Button } from "@/shared/components/ui/button";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { postTone } from "@/modules/creation-studio/types/content-type";

const PostToneSelector = () => {
  const [open, setOpen] = useState(false);
  const [_postTone, setPostTone] = useState(postTone[0]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          onClick={() => setOpen(!open)}
          className="group flex items-center gap-2 px-4 py-2.5 bg-surface-container-low/80 backdrop-blur-md hover:bg-surface-container border border-outline-variant/30 rounded-full"
        >
          <_postTone.icon className="w-5 h-5 mr-2" />
          {_postTone.label} <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[99999] max-w-[150px]">
        <DropdownMenuGroup>
          {postTone.map((postTone) => (
            <DropdownMenuItem
              key={postTone.value}
              onClick={() => setPostTone(postTone)}
              className=""
            >
              <postTone.icon className="w-4 h-4 mr-2" />
              {postTone.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default PostToneSelector;
