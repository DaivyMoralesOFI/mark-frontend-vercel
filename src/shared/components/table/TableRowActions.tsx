import { Row } from "@tanstack/react-table";
import { LucideIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/Button";
import TooltipHover from "../tooltip/TooltipHover";

export interface RowAction {
  label: string;
  onClick: (row: any) => void;
  separator?: boolean;
  icon?: LucideIcon;
}

interface DynamicRowActionsProps<TData> {
  row: Row<TData>;
  actions: RowAction[];
}

export function DynamicRowActions<TData>({
  row,
  actions,
}: DynamicRowActionsProps<TData>) {
  if (!actions.length) return null;

  return (
    <div className="flex items-center space-x-2">
      {actions.map((action, index) => (
        <TooltipHover title={action.label} className="hidden md:inline-flex">
          <Button
            key={index}
            variant="ghost"
            onClick={() => action.onClick(row.original)}
            className="h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            {action.icon && <action.icon className="h-4 w-4" />}
          </Button>
        </TooltipHover>
      ))}
    </div>
  );
}
