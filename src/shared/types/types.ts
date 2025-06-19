import { LucideIcon } from "lucide-react";

interface AppHeaderActions{
    label: string;
    icon: LucideIcon;
    type?: "link" | "button" | "tigger"
    href?: string;
    onClick?:()=>void; 
    className?: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}



export type {
    AppHeaderActions
}