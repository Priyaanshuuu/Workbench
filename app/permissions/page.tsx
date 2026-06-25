import { Croissant_One, Black_Ops_One, Bebas_Neue } from "next/font/google";
import { Key, ShieldAlert } from "lucide-react";
import { store } from "@/lib/store";
import { PermissionExplorer } from "@/components/permissions/PermissionExplorer";

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

interface SearchParams { searchParams: Promise<{ user?: string }> }

export default async function PermissionsPage({ searchParams }: SearchParams) {
  const { user: defaultUserId } = await searchParams;
  const users = store.getAllUsers();
  const enriched = users.map((user) => ({ ...user, roles: store.getRolesForUser(user.id) }));

  return (
    <div className={`min-h-screen bg-[#0a0a0a] text-zinc-100 p-6 md:p-8 space-y-8 ${bebas.className} tracking-wide`}>
      
      {/* High-End Header Section */}
      <div className="group cursor-default">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 shadow-[0_0_20px_rgba(5,150,105,0.3)] group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(5,150,105,0.5)] transition-all duration-300 ease-out">
            <Key className="h-7 w-7 text-white" />
          </div>
          <h1 className={`text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 ${croissant.className}`}>
            Effective Permissions
          </h1>
        </div>
        <p className="mt-2 text-xl md:text-2xl text-zinc-400 ml-[4.5rem] tracking-wider max-w-4xl leading-relaxed">
          Select a user to see their resolved permissions — the union of all roles they hold, with attribution showing which role grants each permission.
        </p>
      </div>

      {enriched.length === 0 ? (
        /* Cinematic Empty State */
        <div className="flex flex-col items-center justify-center rounded-3xl border border-zinc-800 border-dashed bg-zinc-900/20 py-24 px-6 hover:bg-zinc-900/40 hover:border-zinc-700 hover:shadow-2xl transition-all duration-500 ease-out text-center group cursor-default">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-800/50 mb-6 shadow-inner group-hover:scale-110 group-hover:bg-zinc-800 transition-all duration-500">
            <ShieldAlert className="h-10 w-10 text-zinc-500 group-hover:text-emerald-500 transition-colors duration-300" />
          </div>
          <h3 className={`text-3xl text-zinc-200 mb-3 ${croissant.className}`}>No Users to Inspect</h3>
          <p className="text-xl text-zinc-500 tracking-wider max-w-md">
            Add users to your workspace to audit their permissions here.
          </p>
        </div>
      ) : (
        /* Container for the Permission Explorer */
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 md:p-8 shadow-2xl backdrop-blur-sm transition-all duration-300">
          <PermissionExplorer 
            users={enriched} 
            defaultUserId={defaultUserId ?? enriched[0]?.id} 
          />
        </div>
      )}
    </div>
  );
}