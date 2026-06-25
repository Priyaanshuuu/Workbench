import Link from "next/link";
import { Croissant_One, Black_Ops_One, Bebas_Neue } from "next/font/google";
import { Plus, Shield } from "lucide-react";
import { store } from "@/lib/store";
import { RoleCard } from "@/components/roles/RoleCard";

// Initialize Fonts
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

export default function RolesPage() {
  const roles = store.getAllRoles();
  const rolesWithCounts = roles.map((role) => ({ ...role, userCount: store.getUsersForRole(role.id).length }));

  return (
    <div className={`min-h-screen bg-[#0a0a0a] text-zinc-100 p-6 md:p-8 space-y-8 ${bebas.className} tracking-wide`}>
      
      {/* High-End Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 group cursor-default">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 shadow-[0_0_20px_rgba(124,58,237,0.3)] group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-300 ease-out">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <h1 className={`text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 ${croissant.className}`}>
              Roles
            </h1>
          </div>
          <p className="mt-2 text-xl md:text-2xl text-zinc-400 ml-[4.5rem] tracking-wider max-w-3xl leading-relaxed">
            Define what each role can do across all resources. Permissions are resolved via union when users hold multiple roles.
          </p>
        </div>

        {/* Cinematic Action Button */}
        <div className="md:pt-2 ml-[4.5rem] md:ml-0">
          <Link 
            href="/roles/new" 
            className="inline-flex items-center gap-3 rounded-xl bg-violet-600/10 border border-violet-500/50 px-6 py-3.5 text-violet-300 shadow-[0_0_15px_rgba(124,58,237,0.15)] hover:bg-violet-600 hover:text-white hover:border-violet-500 hover:scale-105 hover:shadow-[0_0_25px_rgba(124,58,237,0.4)] transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
          >
            <Plus className="h-5 w-5" />
            <span className={`text-xl tracking-widest mt-0.5 ${blackOps.className}`}>NEW ROLE</span>
          </Link>
        </div>
      </div>

      {rolesWithCounts.length === 0 ? (
        /* Themed Empty State */
        <div className="flex flex-col items-center justify-center rounded-3xl border border-zinc-800 border-dashed bg-zinc-900/20 py-24 px-6 hover:bg-zinc-900/40 hover:border-zinc-700 hover:shadow-2xl transition-all duration-500 ease-out text-center group cursor-default">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-800/50 mb-6 shadow-inner group-hover:scale-110 group-hover:bg-zinc-800 transition-all duration-500">
            <Shield className="h-10 w-10 text-zinc-500 group-hover:text-violet-500 transition-colors duration-300" />
          </div>
          <h3 className={`text-3xl text-zinc-200 mb-3 ${croissant.className}`}>No Roles Yet</h3>
          <p className="text-xl text-zinc-500 tracking-wider max-w-md mb-8">
            Create your first role to start managing permissions for your team.
          </p>
          <Link 
            href="/roles/new" 
            className="inline-flex items-center gap-3 rounded-xl bg-violet-600/10 border border-violet-500/50 px-6 py-3.5 text-violet-300 hover:bg-violet-600 hover:text-white hover:border-violet-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all duration-300 ease-out"
          >
            <Plus className="h-5 w-5" />
            <span className={`text-xl tracking-widest mt-0.5 ${blackOps.className}`}>CREATE ROLE</span>
          </Link>
        </div>
      ) : (
        /* Role Cards Grid */
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3 pt-4">
          {rolesWithCounts.map((role) => (
            <div key={role.id} className="hover:scale-[1.02] transition-transform duration-300 ease-out">
              <RoleCard role={role} userCount={role.userCount} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}