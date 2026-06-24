import Link from "next/link";
import { Shield, Users, Key, Layers, ArrowRight, CheckCircle2, GitMerge } from "lucide-react";
import { store } from "@/lib/store";
import { ALL_PERMISSIONS, RESOURCES } from "@/lib/constants";
import { StatCard } from "@/components/ui/StateCard";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { Avatar } from "@/components/ui/avatar";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const roles = store.getAllRoles();
  const users = store.getAllUsers();
  const usersWithMultipleRoles = users.filter((u) => u.roleIds.length > 1);
  const mostPermissiveRole = roles.reduce<{ name: string; count: number; color: string } | null>(
    (max, role) => (!max || role.permissions.length > max.count)
      ? { name: role.name, count: role.permissions.length, color: role.color }
      : max,
    null
  );
  const recentRoles = [...roles].reverse().slice(0, 3);
  const enrichedUsers = users.slice(0, 4).map((user) => ({ ...user, roles: store.getRolesForUser(user.id) }));

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 shadow">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Workbench</h1>
        </div>
        <p className="mt-1 text-sm text-gray-500 ml-12">
          Role & Permission Builder — manage access control for your SaaS platform.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Roles" value={roles.length} description={`${roles.filter((r) => r.isSystem).length} system · ${roles.filter((r) => !r.isSystem).length} custom`} icon={<Shield className="h-5 w-5" />} accent="violet" />
        <StatCard label="Users" value={users.length} description={`${usersWithMultipleRoles.length} with multiple roles`} icon={<Users className="h-5 w-5" />} accent="blue" />
        <StatCard label="Resources" value={RESOURCES.length} description="Projects, Tasks, Members, Billing, Settings" icon={<Layers className="h-5 w-5" />} accent="emerald" />
        <StatCard label="Permissions" value={ALL_PERMISSIONS.length} description="Total definable permission actions" icon={<Key className="h-5 w-5" />} accent="amber" />
      </div>

      <div className="rounded-xl border border-violet-200 bg-violet-50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 flex-shrink-0">
            <GitMerge className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-violet-900">UNION Permission Strategy</p>
            <p className="mt-1 text-sm text-violet-700 leading-relaxed">
              When a user holds multiple roles, their effective permissions are the union of all roles. Roles are strictly additive — assigning a role always expands permissions, never restricts them. Every permission is traceable to the role(s) that granted it.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Roles</h2>
            <Link href="/roles" className="text-xs text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentRoles.map((role) => (
              <Link key={role.id} href={`/roles/${role.id}`} className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 hover:border-violet-200 hover:bg-violet-50/50 transition-all">
                <RoleBadge name={role.name} color={role.color} />
                <p className="flex-1 text-xs text-gray-500 line-clamp-1">{role.description}</p>
                <span className="text-xs text-gray-400 flex-shrink-0">{role.permissions.length} perms</span>
              </Link>
            ))}
          </div>
          {mostPermissiveRole && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Most permissive: <span className="font-semibold text-gray-600">{mostPermissiveRole.name}</span> ({mostPermissiveRole.count} permissions)
              </p>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Users</h2>
            <Link href="/users" className="text-xs text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {enrichedUsers.map((user) => (
              <Link key={user.id} href={`/users/${user.id}`} className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 hover:border-violet-200 hover:bg-violet-50/50 transition-all">
                <Avatar initials={user.initials} color={user.avatarColor} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
                <div className="flex gap-1 flex-wrap justify-end">
                  {user.roles.length === 0
                    ? <span className="text-xs text-gray-400 italic">No roles</span>
                    : user.roles.map((r) => <RoleBadge key={r.id} name={r.name} color={r.color} size="sm" />)
                  }
                </div>
              </Link>
            ))}
          </div>
          {usersWithMultipleRoles.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                {usersWithMultipleRoles.length} {usersWithMultipleRoles.length === 1 ? "user has" : "users have"} multiple roles with merged permissions
              </p>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { href: "/roles/new", icon: <Shield className="h-4 w-4" />, bg: "bg-violet-100 text-violet-600 group-hover:bg-violet-600 group-hover:text-white", title: "Create Role", desc: "Define a new access level" },
            { href: "/users", icon: <Users className="h-4 w-4" />, bg: "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white", title: "Manage Users", desc: "Assign and update roles" },
            { href: "/permissions", icon: <Key className="h-4 w-4" />, bg: "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white", title: "Audit Permissions", desc: "Resolve effective access" },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4 hover:border-violet-300 hover:shadow-sm transition-all group">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${item.bg}`}>{item.icon}</div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}