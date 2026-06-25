import { notFound } from "next/navigation";
import Link from "next/link";
import { Croissant_One, Black_Ops_One, Bebas_Neue } from "next/font/google";
import { ChevronLeft, Key, UserCircle } from "lucide-react";
import { store } from "@/lib/store";
import { buildUserResolvedPermissions } from "@/lib/permission";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { RoleAssignment } from "@/components/users/RoleAssignment";
import { RESOURCES } from "@/lib/constants";
import { cn } from "@/lib/utils";

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
type Params = { params: Promise<{ id: string }> };

export default async function UserDetailPage({ params }: Params) {
  const { id } = await params;
  const user = store.getUserById(id);
  if (!user) notFound();

  const allRoles = store.getAllRoles();
  const assignedRoles = store.getRolesForUser(id);
  const resolved = buildUserResolvedPermissions(user, assignedRoles);

  return (
    <div className={`min-h-[calc(100vh-2rem)] bg-[#0a0a0a] text-zinc-100 flex flex-col items-center justify-center p-6 md:p-8 ${bebas.className} tracking-wide`}>
      
      <div className="w-full max-w-6xl">
      
        <Link 
          href="/users" 
          className={`mb-8 inline-flex items-center gap-2 text-zinc-500 hover:text-blue-400 hover:-translate-x-2 transition-all duration-300 ease-out ${blackOps.className} tracking-widest text-lg`}
        >
          <ChevronLeft className="h-5 w-5" />
          BACK TO USERS
        </Link>

        <div className="mb-8 flex flex-col md:flex-row md:items-center gap-6 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 md:p-8 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:border-zinc-700 hover:shadow-[0_0_40px_rgba(37,99,235,0.1)]">
          <Avatar className="h-20 w-20 md:h-24 md:w-24 border-2 border-zinc-800 shadow-xl">
            <AvatarFallback 
              style={{ 
                backgroundColor: user.avatarColor || '#1e1e24', 
                color: user.avatarColor ? '#ffffff' : '#a1a1aa' 
              }}
              className={`text-3xl ${blackOps.className}`}
            >
              {user.initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h1 className={`text-3xl md:text-4xl text-zinc-100 ${croissant.className}`}>{user.name}</h1>
            <p className="text-lg md:text-xl text-zinc-400 mt-1 tracking-widest">{user.email}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {assignedRoles.length === 0
                ? <span className="text-base text-zinc-600 italic">No roles assigned</span>
                : assignedRoles.map((role) => <RoleBadge key={role.id} name={role.name} color={role.color} />)
              }
            </div>
          </div>

          <div className="text-left md:text-right flex-shrink-0 bg-blue-950/30 border border-blue-500/20 p-5 rounded-2xl backdrop-blur-md">
            <p className={`text-4xl text-blue-400 shadow-blue-500/50 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] ${blackOps.className}`}>
              {resolved.totalPermissions}
            </p>
            <p className="text-lg text-blue-200/50 tracking-wider mt-1">EFFECTIVE PERMISSIONS</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 md:p-8 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:border-zinc-700 h-full">
              <div className="flex items-center gap-3 mb-6">
                <UserCircle className="h-6 w-6 text-blue-500" />
                <h2 className={`text-2xl text-zinc-100 ${croissant.className}`}>Role Management</h2>
              </div>
              <RoleAssignment userId={user.id} assignedRoles={assignedRoles} allRoles={allRoles} />
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 md:p-8 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:border-zinc-700 h-full">
              
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-zinc-800/80">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/20 border border-emerald-500/30">
                  <Key className="h-5 w-5 text-emerald-400" />
                </div>
                <h2 className={`text-2xl text-zinc-100 ${croissant.className}`}>Effective Permissions</h2>
                <span className={`ml-auto text-sm text-zinc-500 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800 tracking-widest ${blackOps.className}`}>UNION MERGED</span>
              </div>

              {resolved.totalPermissions === 0 ? (
                <div className="py-12 text-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20">
                  <p className="text-xl text-zinc-500 tracking-wider">Assign a role to see effective permissions.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {RESOURCES.map((resource) => {
                    const resourcePerms = resolved.byResource[resource.key] ?? [];
                    if (resourcePerms.length === 0) return null;
                    return (
                      <div key={resource.key} className="group">
                        <p className={`text-sm text-zinc-400 mb-3 tracking-widest ${blackOps.className}`}>
                          {resource.label}
                        </p>
                      
                        <div className="flex flex-wrap gap-2.5">
                          {resource.actions.map((action) => {
                            const granted = resourcePerms.find((p) => p.action === action.key);
                            return (
                              <span
                                key={action.key}
                                className={cn(
                                  "inline-flex items-center rounded-lg px-4 py-2 text-lg transition-all duration-300",
                                  granted 
                                    ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(5,150,105,0.1)] hover:bg-emerald-500/20 hover:scale-105 cursor-default" 
                                    : "bg-zinc-800/30 text-zinc-600 border border-zinc-800/80 grayscale opacity-60"
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
                <div className="mt-8 pt-6 border-t border-zinc-800/80">
                  <Link 
                    href={`/permissions?user=${user.id}`} 
                    className={`inline-flex items-center gap-2 text-lg text-emerald-400 hover:text-emerald-300 hover:translate-x-2 transition-all duration-300 ease-out ${blackOps.className} tracking-widest`}
                  >
                    VIEW FULL PERMISSION AUDIT →
                  </Link>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}