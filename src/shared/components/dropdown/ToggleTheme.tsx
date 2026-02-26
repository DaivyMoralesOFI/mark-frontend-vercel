import { useTheme } from "@/core/context/ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/DropdownMenu";
import { Button } from "@/shared/components/ui/Button";

export default function ToggleTheme() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="hidden md:inline-flex">
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer p-0 px-0 h-7 text-secondary-foreground"
        >
          <Sun
            className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            strokeWidth={2}
            size={12}
          />
          <Moon
            className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            strokeWidth={2}
            size={12}
          />
          <span className="sr-only">Theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            setTheme("light");
          }}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setTheme("dark");
          }}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setTheme("system");
          }}
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
