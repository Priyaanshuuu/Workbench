import { cn } from "@/lib/utils";
import { ROLE_COLOR_CLASSES } from "@/lib/constants";
import type { RoleColor } from "@/lib/constants";

interface RoleBadgeProps {
  name: string;
  color: string;
  size?: "sm" | "md";
  className?: string;
}

export function RoleBadge({ name, color, size = "md", className }: RoleBadgeProps) {
  const colorKey = color as RoleColor;
  const classes = ROLE_COLOR_CLASSES[colorKey] ?? ROLE_COLOR_CLASSES.blue;
  return (
    <span className={cn(
      "inline-flex items-center rounded-full font-medium",
      classes.badge,
      size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
      className
    )}>
      <span className={cn(
        "mr-1.5 inline-block rounded-full bg-current opacity-60",
        size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2"
      )} />
      {name}
    </span>
  );
}