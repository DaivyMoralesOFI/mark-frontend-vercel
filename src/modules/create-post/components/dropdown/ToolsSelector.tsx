import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/shared/components/ui/DropdownMenu";
import { useState } from "react";
import { Plus } from "lucide-react";
import { tools } from "@/modules/create-post/utils/definitions";
import { cn } from "@/shared/utils/utils";

const ToolsSelector = () => {
  const [open, setOpen] = useState(false);
  const [_tools, setTools] = useState(tools[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            "group flex items-center justify-center w-8 h-8 rounded-lg",
            "text-on-surface-variant/60 hover:text-on-surface",
            "hover:bg-on-surface/[0.04] active:bg-on-surface/[0.06]",
            "transition-all duration-200",
            "outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1"
          )}
        >
          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" strokeWidth={1.8} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="z-[99999] min-w-[170px] p-1"
        align="start"
        sideOffset={8}
      >
        <div className="px-2 py-1.5 mb-0.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
            Attach
          </span>
        </div>
        <DropdownMenuGroup>
          {tools.map((tool) => (
            <DropdownMenuItem
              key={tool.label}
              onClick={() => setTools(tool)}
              className={cn(
                "flex items-center gap-2.5 px-2.5 py-2 cursor-pointer rounded-lg mx-0.5 my-px",
                "text-xs font-medium text-on-surface-variant",
                "focus:bg-on-surface/[0.04] focus:text-on-surface",
                "transition-colors duration-150"
              )}
            >
              <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 bg-on-surface/[0.04]">
                <tool.icon className="w-3.5 h-3.5" strokeWidth={1.8} />
              </div>
              <span className="flex-1">{tool.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ToolsSelector;
