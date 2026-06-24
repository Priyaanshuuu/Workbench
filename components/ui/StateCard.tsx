import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  accent?: "violet" | "blue" | "emerald" | "amber";
  className?: string;
}

const ACCENT_CLASSES = {
  violet:  { icon: "bg-violet-100 text-violet-600",  value: "text-violet-700" },
  blue:    { icon: "bg-blue-100 text-blue-600",       value: "text-blue-700" },
  emerald: { icon: "bg-emerald-100 text-emerald-600", value: "text-emerald-700" },
  amber:   { icon: "bg-amber-100 text-amber-600",     value: "text-amber-700" },
};

export function StatCard({ label, value, description, icon, accent = "violet", className }: StatCardProps) {
  const classes = ACCENT_CLASSES[accent];
  return (
    <div className={cn("rounded-xl border border-gray-200 bg-white p-5 shadow-sm", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">{label}</p>
          <p className={cn("mt-2 text-3xl font-bold tracking-tight", classes.value)}>{value}</p>
          {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
        </div>
        {icon && <div className={cn("rounded-lg p-2.5", classes.icon)}>{icon}</div>}
      </div>
    </div>
  );
}