import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Actions } from "@/shared/types/types";
import { cn } from "@/shared/utils/utils";

// Componente individual para una acción
const AppHeaderAction: React.FC<Actions> = (props) => {
  switch (props.type) {
    case "router":
      return (
        <Link to={props.to}>
          <Button variant={props.variant}>
            <props.icon />
            {props.children}
          </Button>
        </Link>
      );
    case "link":
      return (
        <a href={props.href}>
          <Button variant={props.variant}>
            <props.icon />
            {props.children}
          </Button>
        </a>
      );
    case "custom":
      return <>{props.node}</>;
    case "button":
    case "tigger":
      return (
        <Button variant={props.variant} onClick={props.onClick}>
          <props.icon />
          {props.children}
        </Button>
      );
  }
};

// Componente para múltiples acciones
type AppHeaderActionsProps = {
  actions: Actions[];
  className?: string;
};

const AppHeaderActions: React.FC<AppHeaderActionsProps> = ({
  actions,
  className,
}) => {
  return (
    <div className={cn(`flex items-center gap-2`, className)}>
      {actions.map((action, index) => (
        <AppHeaderAction key={index} {...action} />
      ))}
    </div>
  );
};

export default AppHeaderActions;
export { AppHeaderAction };
