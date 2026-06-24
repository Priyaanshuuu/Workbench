import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Role, User } from "@/lib/types";
import { Avatar } from "../ui/avatar";
import { RoleBadge } from "@/components/ui/RoleBadge";

interface UserCardProps {
  user: User;
  roles: Role[];
}

export function UserCard({ user, roles }: UserCardProps) {
  return (
    <Link
      href={`/users/${user.id}`}
      className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-violet-200 transition-all duration-200"
    >
      <Avatar initials={user.initials} color={user.avatarColor} size="lg" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
          {roles.length > 1 && (
            <span className="inline-flex items-center rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
              {roles.length} roles
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {roles.length === 0
            ? <span className="text-xs text-gray-400 italic">No roles assigned</span>
            : roles.map((role) => <RoleBadge key={role.id} name={role.name} color={role.color} size="sm" />)
          }
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-gray-300 flex-shrink-0 group-hover:text-violet-400 transition-colors" />
    </Link>
  );
}