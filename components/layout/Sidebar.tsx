"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Shield, Users, Key, Layers, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/",            label: "Dashboard",   icon: LayoutDashboard, exact: true },
  { href: "/roles",       label: "Roles",        icon: Shield,          exact: false },
  { href: "/users",       label: "Users",        icon: Users,           exact: false },
  { href: "/permissions", label: "Permissions",  icon: Key,             exact: false },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <aside
      className="flex h-screen w-60 flex-col flex-shrink-0 border-r border-[hsl(224,14%,14%)]"
      style={{ backgroundColor: "hsl(224,14%,8%)" }}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5 border-b border-[hsl(224,14%,14%)]">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 shadow-lg">
          <Layers className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white tracking-tight">Workbench</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Admin Console</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-2 mb-3 text-[10px] font-semibold uppercase tracking-widest text-gray-600">
          Navigation
        </p>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-150",
                active
                  ? "sidebar-item-active"
                  : "text-gray-400 hover:bg-[hsl(224,14%,14%)] hover:text-gray-200"
              )}
            >
              <Icon className={cn(
                "h-4 w-4 flex-shrink-0 transition-colors",
                active ? "text-violet-400" : "text-gray-500 group-hover:text-gray-300"
              )} />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight className="h-3 w-3 text-violet-400 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-[hsl(224,14%,14%)]">
        <div className="rounded-lg bg-violet-950/40 border border-violet-900/30 p-3">
          <p className="text-xs font-medium text-violet-300">UNION Strategy</p>
          <p className="mt-1 text-[11px] text-gray-500 leading-relaxed">
            Permissions are merged additively across all assigned roles.
          </p>
        </div>
      </div>
    </aside>
  );
}