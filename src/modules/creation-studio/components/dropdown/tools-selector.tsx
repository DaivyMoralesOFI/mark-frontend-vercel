import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Button } from "@/shared/components/ui/button";
import { useState } from "react";
import { Plus } from "lucide-react";
import { tools } from "@/modules/creation-studio/utils/definitions";

const ToolsSelector = () => {
  const [open, setOpen] = useState(false);
  const [_tools, setTools] = useState(tools[0]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          onClick={() => setOpen(!open)}
          className="group flex items-center gap-2 px-4 py-2.5 bg-surface-container-low/80 backdrop-blur-md hover:bg-surface-container border border-outline-variant/30 rounded-full"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[99999] max-w-[150px]" align="start">
        <DropdownMenuGroup>
          {tools.map((tool) => (
            <DropdownMenuItem
              key={tool.label}
              onClick={() => setTools(tool)}
              className="flex items-center gap-2 px-4 py-2.5 hover:bg-surface-container"
            >
              <tool.icon className="w-5 h-5" />
              {tool.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ToolsSelector;
