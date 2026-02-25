import { LucideIcon } from "lucide-react";

export interface Platform {
  id: string;
  name: string;
  logo_outline: string;
  logo_fill: string;
  color: string;
}

export interface PostTone {
  value: string;
  label: string;
  icon: LucideIcon;
}

export interface PostType {
  value: string;
  label: string;
  icon: LucideIcon;
}

export interface Tools {
  value: string;
  label: string;
  icon: LucideIcon;
}
