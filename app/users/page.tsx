import { Users } from "lucide-react";
import { store } from "@/lib/store";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { UserCard } from "@/components/users/UserCard";

export const dynamic = "force-dynamic";

export default function UsersPage() {
  const users = store.getAllUsers();
  const enriched = users.map((user) => ({ ...user, roles: store.getRolesForUser(user.id) }));

  return (
    <div>
      <PageHeader
        title="Users"
        description="Assign roles to users. A user can hold multiple roles — their effective permissions are the union of all assigned roles."
      />
      {enriched.length === 0 ? (
        <EmptyState icon={<Users className="h-7 w-7" />} title="No users yet" description="Users will appear here once they join your workspace." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {enriched.map((user) => <UserCard key={user.id} user={user} roles={user.roles} />)}
        </div>
      )}
    </div>
  );
}