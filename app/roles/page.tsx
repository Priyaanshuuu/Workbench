import Link from "next/link";
import { Plus, Shield } from "lucide-react";
import { store } from "@/lib/store";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { RoleCard } from "@/components/roles/RoleCard";

export const dynamic = "force-dynamic";

export default function RolesPage() {
  const roles = store.getAllRoles();
  const rolesWithCounts = roles.map((role) => ({ ...role, userCount: store.getUsersForRole(role.id).length }));

  return (
    <div>
      <PageHeader
        title="Roles"
        description="Define what each role can do across all resources. Permissions are resolved via union when users hold multiple roles."
        action={
          <Link href="/roles/new" className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2">
            <Plus className="h-4 w-4" />
            New Role
          </Link>
        }
      />
      {rolesWithCounts.length === 0 ? (
        <EmptyState
          icon={<Shield className="h-7 w-7" />}
          title="No roles yet"
          description="Create your first role to start managing permissions for your team."
          action={
            <Link href="/roles/new" className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 transition-colors">
              <Plus className="h-4 w-4" />
              Create Role
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {rolesWithCounts.map((role) => <RoleCard key={role.id} role={role} userCount={role.userCount} />)}
        </div>
      )}
    </div>
  );
}