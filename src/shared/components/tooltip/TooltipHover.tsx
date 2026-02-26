import { Button } from "@/shared/components/ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/Tooltip";

interface TooltipInfoHoverProps {
  action?: () => void;
  title: string;
  content?: string;
  children: React.ReactNode;
  className?: string;
  side?: "top" | "right" | "bottom" | "left" | undefined;
}

const TooltipHover: React.FC<TooltipInfoHoverProps> = ({
  children,
  action,
  title,
  content,
  className,
  side,
}) => {
  return (
    <Tooltip>
      <TooltipTrigger className={className} asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent className="text-center" side={side}>
        <h4 className="font-medium">{title}</h4>
        <p>{content}</p>
        {action && <Button onClick={action}></Button>}
      </TooltipContent>
    </Tooltip>
  );
};

export default TooltipHover;
