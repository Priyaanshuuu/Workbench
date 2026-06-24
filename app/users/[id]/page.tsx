import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Key } from "lucide-react";
import { store } from "@/lib/store";
import { buildUserResolvedPermissions } from "@/lib/permission";
import { Avatar } from "@/components/ui/avatar";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { RoleAssignment } from "@/components/users/RoleAssignment";
import { RESOURCES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
type Params = { params: Promise<{ id: string }> };

export default async function UserDetailPage({ params }: Params) {
  const { id } = await params;
  const user = store.getUserById(id);
  if (!user) notFound();

  const allRoles = store.getAllRoles();
  const assignedRoles = store.getRolesForUser(id);
  const resolved = buildUserResolvedPermissions(user, assignedRoles);

  return (
    <div>
      <Link href="/users" className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
        <ChevronLeft className="h-4 w-4" />
        Back to Users
      </Link>

      <div className="mb-8 flex items-center gap-5 rounded-xl border border-gray-200 bg-white p-6">
        <Avatar initials={user.initials} color={user.avatarColor} size="lg" />
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold text-gray-900">{user.name}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {assignedRoles.length === 0
              ? <span className="text-xs text-gray-400 italic">No roles assigned</span>
              : assignedRoles.map((role) => <RoleBadge key={role.id} name={role.name} color={role.color} />)
            }
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-2xl font-bold text-violet-600">{resolved.totalPermissions}</p>
          <p className="text-xs text-gray-400">effective permissions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-5">Role Management</h2>
            <RoleAssignment userId={user.id} assignedRoles={assignedRoles} allRoles={allRoles} />
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-5">
              <Key className="h-4 w-4 text-violet-500" />
              <h2 className="text-sm font-semibold text-gray-900">Effective Permissions</h2>
              <span className="ml-auto text-xs text-gray-400">UNION of all roles</span>
            </div>
            {resolved.totalPermissions === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-gray-400">Assign a role to see effective permissions</p>
              </div>
            ) : (
              <div className="space-y-4">
                {RESOURCES.map((resource) => {
                  const resourcePerms = resolved.byResource[resource.key] ?? [];
                  if (resourcePerms.length === 0) return null;
                  return (
                    <div key={resource.key}>
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">{resource.label}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {resource.actions.map((action) => {
                          const granted = resourcePerms.find((p) => p.action === action.key);
                          return (
                            <span
                              key={action.key}
                              className={cn(
                                "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium",
                                granted ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-gray-50 text-gray-300 border border-gray-100"
                              )}
                              title={granted ? `Granted by: ${granted.grantedBy.map((g) => g.roleName).join(", ")}` : "Not granted"}
                            >
                              {action.label}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {resolved.totalPermissions > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link href={`/permissions?user=${user.id}`} className="text-xs font-medium text-violet-600 hover:text-violet-700 transition-colors">
                  View full permission audit →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}