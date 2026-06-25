import { notFound } from "next/navigation";
import Link from "next/link";
import { Croissant_One, Black_Ops_One, Bebas_Neue } from "next/font/google";
import { ChevronLeft, Lock, Shield } from "lucide-react";
import { store } from "@/lib/store";
import { RoleForm } from "@/components/roles/RoleForm";
import { RoleBadge } from "@/components/ui/RoleBadge";

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

export default async function EditRolePage({ params }: Params) {
  const { id } = await params;
  const role = store.getRoleById(id);
  
  if (!role) notFound();
  
  const users = store.getUsersForRole(id);

  return (
    <div className={`min-h-[calc(100vh-2rem)] bg-[#0a0a0a] text-zinc-100 flex flex-col items-center justify-center p-6 md:p-8 ${bebas.className} tracking-wide`}>
      
      <div className="w-full max-w-3xl">
  
        <Link 
          href="/roles" 
          className={`mb-8 inline-flex items-center gap-2 text-zinc-500 hover:text-violet-400 hover:-translate-x-2 transition-all duration-300 ease-out ${blackOps.className} tracking-widest text-lg`}
        >
          <ChevronLeft className="h-5 w-5" />
          BACK TO ROLES
        </Link>
        
        <div className="group cursor-default mb-10 flex flex-col items-start">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 shadow-[0_0_20px_rgba(124,58,237,0.3)] group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-300 ease-out">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <h1 className={`text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 ${croissant.className}`}>
              Edit Role
            </h1>
          </div>

          <div className="ml-[4.5rem] flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <RoleBadge name={role.name} color={role.color} />
              {role.isSystem && (
                <span className={`inline-flex items-center gap-1.5 rounded-full bg-zinc-800/80 border border-zinc-700 px-3 py-1 text-sm text-zinc-400 shadow-inner ${blackOps.className} tracking-widest`}>
                  <Lock className="h-3.5 w-3.5" />
                  SYSTEM
                </span>
              )}
            </div>
            <p className="mt-1 text-xl md:text-2xl text-zinc-400 tracking-wider">
              <span className={`text-zinc-200 tracking-widest ${blackOps.className}`}>{users.length}</span> {users.length === 1 ? "user has" : "users have"} this role <span className="text-zinc-700 mx-1">|</span> <span className={`text-zinc-200 tracking-widest ${blackOps.className}`}>{role.permissions.length}</span> permission{role.permissions.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 md:p-10 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/50 hover:shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <RoleForm role={role} mode="edit" />
        </div>

      </div>
    </div>
  );
}