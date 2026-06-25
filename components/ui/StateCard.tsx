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
  violet:  { 
    icon: "bg-violet-500/10 text-violet-400 border-violet-500/20 shadow-[0_0_15px_rgba(124,58,237,0.15)]", 
    value: "text-violet-400 drop-shadow-[0_0_15px_rgba(124,58,237,0.2)]" 
  },
  blue:    { 
    icon: "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.15)]", 
    value: "text-blue-400 drop-shadow-[0_0_15px_rgba(37,99,235,0.2)]" 
  },
  emerald: { 
    icon: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(5,150,105,0.15)]", 
    value: "text-emerald-400 drop-shadow-[0_0_15px_rgba(5,150,105,0.2)]" 
  },
  amber:   { 
    icon: "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)]", 
    value: "text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.2)]" 
  },
};

export function StatCard({ label, value, description, icon, accent = "violet", className }: StatCardProps) {
  const classes = ACCENT_CLASSES[accent];
  
  return (
    <div className={cn(
      "rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 shadow-xl backdrop-blur-sm transition-all duration-300", 
      className
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
            {label}
          </p>
          <p className={cn("mt-2 text-4xl tracking-widest", classes.value)}>
            {value}
          </p>
          {description && (
            <p className="mt-2 text-sm text-zinc-400 font-light tracking-wider line-clamp-2">
              {description}
            </p>
          )}
        </div>
        {icon && (
          <div className={cn("flex items-center justify-center rounded-xl border p-3 flex-shrink-0 transition-colors", classes.icon)}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}