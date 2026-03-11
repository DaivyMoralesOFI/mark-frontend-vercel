import { LucideIcon } from "lucide-react";

type BaseActionProps = {
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "error";
};

// Union types discriminados para Actions
type RouterAction = BaseActionProps & {
  type: "router";
  to: string;
  icon: LucideIcon;
};

type LinkAction = BaseActionProps & {
  type: "link";
  href: string;
  icon: LucideIcon;
};

type ButtonAction = BaseActionProps & {
  type: "button" | "tigger";
  icon: LucideIcon;
};

type CustomAction = BaseActionProps & {
  type: "custom";
  node: React.ReactNode;
};

// Tipo principal Actions como union discriminado
export type Actions = RouterAction | LinkAction | ButtonAction | CustomAction;

type BasePageProps = {
  children: React.ReactNode;
  className?: string;
  layout?: "flex" | "grid";
  title: string;
};

type SEOPageProps = BasePageProps & {
  description: string;
  content: string;
};

type ActionsProps = BasePageProps & {
  actions: Actions[];
};

type TabsProps = BasePageProps & {
  tabs: string[];
};

export type PageProps = SEOPageProps | ActionsProps | TabsProps;

export type Trigger = {
  icon: LucideIcon;
  label: string;
  slug: string;
};
