import Link from "next/link";
import { Croissant_One, Black_Ops_One, Bebas_Neue } from "next/font/google";
import { Shield, Users, Key, Layers, ArrowRight, CheckCircle2, GitMerge } from "lucide-react";
import { store } from "@/lib/store";
import { ALL_PERMISSIONS, RESOURCES } from "@/lib/constants";
import { StatCard } from "@/components/ui/StateCard";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Initialize Fonts (Safely using string "400" for single-weight fonts)
const croissant = Croissant_One({ 
  subsets: ["latin"],
  weight: "400",
  display: 'swap',
});

const blackOps = Black_Ops_One({
  subsets: ["latin"],
  weight: "400",
  display: 'swap',
});

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: 'swap',
});

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
    <div className={`min-h-screen bg-[#0a0a0a] text-zinc-100 p-6 md:p-8 space-y-8 ${bebas.className} tracking-wide`}>
      
      {/* Header Section */}
      <div className="group cursor-default">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 shadow-[0_0_20px_rgba(124,58,237,0.3)] group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-300 ease-out">
            <Layers className="h-7 w-7 text-white" />
          </div>
          <h1 className={`text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 ${croissant.className}`}>
            Workbench
          </h1>
        </div>
        <p className="mt-2 text-xl md:text-2xl text-zinc-400 ml-[4.5rem] tracking-wider">
          Role & Permission Builder — manage access control for your SaaS platform.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="hover:scale-[1.03] transition-transform duration-300 ease-out hover:shadow-lg hover:shadow-violet-500/10 rounded-xl">
          <StatCard label="Roles" value={roles.length} description={`${roles.filter((r) => r.isSystem).length} system · ${roles.filter((r) => !r.isSystem).length} custom`} icon={<Shield className="h-6 w-6" />} accent="violet" />
        </div>
        <div className="hover:scale-[1.03] transition-transform duration-300 ease-out hover:shadow-lg hover:shadow-blue-500/10 rounded-xl">
          <StatCard label="Users" value={users.length} description={`${usersWithMultipleRoles.length} with multiple roles`} icon={<Users className="h-6 w-6" />} accent="blue" />
        </div>
        <div className="hover:scale-[1.03] transition-transform duration-300 ease-out hover:shadow-lg hover:shadow-emerald-500/10 rounded-xl">
          <StatCard label="Resources" value={RESOURCES.length} description="Projects, Tasks, Members, Billing, Settings" icon={<Layers className="h-6 w-6" />} accent="emerald" />
        </div>
        <div className="hover:scale-[1.03] transition-transform duration-300 ease-out hover:shadow-lg hover:shadow-amber-500/10 rounded-xl">
          <StatCard label="Permissions" value={ALL_PERMISSIONS.length} description="Total definable permission actions" icon={<Key className="h-6 w-6" />} accent="amber" />
        </div>
      </div>
      <div className="rounded-2xl border border-violet-500/20 bg-violet-950/20 p-6 backdrop-blur-sm hover:scale-[1.01] hover:bg-violet-950/30 hover:border-violet-500/30 hover:shadow-[0_0_30px_rgba(124,58,237,0.1)] transition-all duration-300 ease-out cursor-default">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/20 border border-violet-500/30 flex-shrink-0">
            <GitMerge className="h-6 w-6 text-violet-400" />
          </div>
          <div>
            <p className={`text-xl text-violet-300 ${croissant.className}`}>Union Permission Strategy</p>
            <p className="mt-3 text-lg text-violet-200/70 leading-relaxed tracking-wider">
              When a user holds multiple roles, their effective permissions are the union of all roles. Roles are strictly additive — assigning a role always expands permissions, never restricts them. Every permission is traceable to the role(s) that granted it.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* Roles Box */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-zinc-700 hover:bg-zinc-900 hover:shadow-2xl transition-all duration-300 ease-out flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl text-zinc-100 ${croissant.className}`}>Recent Roles</h2>
            <Link href="/roles" className="text-lg text-violet-400 hover:text-violet-300 flex items-center gap-1.5 transition-colors group">
              View all <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="space-y-4 flex-1">
            {recentRoles.map((role) => (
              <Link key={role.id} href={`/roles/${role.id}`} className="flex items-center gap-4 rounded-xl border border-zinc-800/50 bg-zinc-950/50 p-4 hover:border-violet-500/40 hover:bg-violet-950/20 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <RoleBadge name={role.name} color={role.color} />
                <p className="flex-1 text-lg text-zinc-400 line-clamp-1 tracking-wider">{role.description}</p>
                <span className={`text-sm text-zinc-400 flex-shrink-0 bg-zinc-900 px-3 py-1.5 rounded-md border border-zinc-800 tracking-widest ${blackOps.className}`}>
                  {role.permissions.length} PERMS
                </span>
              </Link>
            ))}
          </div>
          {mostPermissiveRole && (
            <div className="mt-6 pt-5 border-t border-zinc-800">
              <p className="text-lg text-zinc-400 flex items-center gap-2 tracking-wider">
                <Shield className="h-5 w-5 text-violet-500" />
                Most permissive: <span className={`text-zinc-200 tracking-widest ml-1 ${blackOps.className}`}>{mostPermissiveRole.name}</span> 
                <span className={`text-zinc-500 ${blackOps.className}`}>({mostPermissiveRole.count})</span>
              </p>
            </div>
          )}
        </div>

        {/* Users Box */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-zinc-700 hover:bg-zinc-900 hover:shadow-2xl transition-all duration-300 ease-out flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl text-zinc-100 ${croissant.className}`}>Key Users</h2>
            <Link href="/users" className="text-lg text-violet-400 hover:text-violet-300 flex items-center gap-1.5 transition-colors group">
              View all <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="space-y-4 flex-1">
            {enrichedUsers.map((user) => (
              <Link key={user.id} href={`/users/${user.id}`} className="flex items-center gap-4 rounded-xl border border-zinc-800/50 bg-zinc-950/50 p-4 hover:border-violet-500/40 hover:bg-violet-950/20 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <Avatar className="h-12 w-12 border border-zinc-800">
                  <AvatarFallback 
                    style={{ 
                      backgroundColor: user.avatarColor || '#27272a', 
                      color: user.avatarColor ? '#ffffff' : '#a1a1aa' 
                    }}
                    className={`text-xl ${blackOps.className}`}
                  >
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xl text-zinc-200 truncate tracking-wider">{user.name}</p>
                  <p className="text-base text-zinc-500 truncate tracking-widest">{user.email}</p>
                </div>
                <div className="flex gap-2 flex-wrap justify-end">
                  {user.roles.length === 0
                    ? <span className="text-base text-zinc-600 italic">No roles</span>
                    : user.roles.map((r) => <RoleBadge key={r.id} name={r.name} color={r.color} />)
                  }
                </div>
              </Link>
            ))}
          </div>
          {usersWithMultipleRoles.length > 0 && (
            <div className="mt-6 pt-5 border-t border-zinc-800">
              <p className="text-lg text-zinc-400 flex items-center gap-2 tracking-wider">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span className={`text-xl text-zinc-200 ${blackOps.className}`}>{usersWithMultipleRoles.length}</span> {usersWithMultipleRoles.length === 1 ? "user has" : "users have"} multiple roles merged
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className={`text-2xl text-zinc-100 mb-5 ml-1 ${croissant.className}`}>Quick Actions</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {[
            { href: "/roles/new", icon: <Shield className="h-6 w-6" />, bg: "bg-violet-500/10 text-violet-400 group-hover:bg-violet-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]", title: "Create Role", desc: "Define a new access level" },
            { href: "/users", icon: <Users className="h-6 w-6" />, bg: "bg-blue-500/10 text-blue-400 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]", title: "Manage Users", desc: "Assign and update roles" },
            { href: "/permissions", icon: <Key className="h-6 w-6" />, bg: "bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(5,150,105,0.4)]", title: "Audit Permissions", desc: "Resolve effective access" },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-zinc-600 hover:bg-zinc-900 hover:scale-105 hover:shadow-xl transition-all duration-300 ease-out group">
              <div className={`flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-300 ${item.bg}`}>
                {item.icon}
              </div>
              <div>
                <p className={`text-xl text-zinc-100 tracking-widest ${blackOps.className}`}>{item.title}</p>
                <p className="text-lg text-zinc-400 mt-1 tracking-wider">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}