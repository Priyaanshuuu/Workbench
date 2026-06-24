import Link from "next/link";
import { Users, Lock, ChevronRight, CheckCircle2 } from "lucide-react";
import type { Role } from "@/lib/types";
import { RESOURCES } from "@/lib/constants";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { cn } from "@/lib/utils";

interface RoleCardProps {
  role: Role;
  userCount: number;
}

export function RoleCard({ role, userCount }: RoleCardProps) {
  const byResource = RESOURCES.map((resource) => ({
    resource,
    granted: resource.actions.filter((a) => role.permissions.includes(a.permission)),
  })).filter((r) => r.granted.length > 0);

  return (
    <Link
      href={`/roles/${role.id}`}
      className="group block rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-violet-200 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <RoleBadge name={role.name} color={role.color} />
            {role.isSystem && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                <Lock className="h-2.5 w-2.5" />
                System
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500 line-clamp-2 leading-relaxed">{role.description}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-gray-300 flex-shrink-0 mt-0.5 group-hover:text-violet-400 transition-colors" />
      </div>

      <div className="mt-4 space-y-1.5">
        {byResource.map(({ resource, granted }) => (
          <div key={resource.key} className="flex items-center gap-2">
            <span className="w-20 text-[11px] font-medium text-gray-400 uppercase tracking-wide flex-shrink-0">
              {resource.label}
            </span>
            <div className="flex flex-wrap gap-1">
              {resource.actions.map((action) => {
                const isGranted = granted.some((g) => g.permission === action.permission);
                return (
                  <span
                    key={action.key}
                    className={cn(
                      "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium",
                      isGranted ? "bg-emerald-50 text-emerald-700" : "bg-gray-50 text-gray-300"
                    )}
                  >
                    {isGranted && <CheckCircle2 className="mr-0.5 h-2.5 w-2.5" />}
                    {action.label}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
        {byResource.length === 0 && <p className="text-xs text-gray-400 italic">No permissions assigned</p>}
      </div>

      <div className="mt-4 flex items-center gap-1.5 border-t border-gray-100 pt-4">
        <Users className="h-3.5 w-3.5 text-gray-400" />
        <span className="text-xs text-gray-500">{userCount} {userCount === 1 ? "user" : "users"}</span>
        <span className="ml-auto text-xs text-gray-400">
          {role.permissions.length} permission{role.permissions.length !== 1 ? "s" : ""}
        </span>
      </div>
    </Link>
  );
}