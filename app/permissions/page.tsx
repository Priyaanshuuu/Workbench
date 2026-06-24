import { Key } from "lucide-react";
import { store } from "@/lib/store";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { PermissionExplorer } from "@/components/permissions/PermissionExplorer";

export const dynamic = "force-dynamic";

interface SearchParams { searchParams: Promise<{ user?: string }> }

export default async function PermissionsPage({ searchParams }: SearchParams) {
  const { user: defaultUserId } = await searchParams;
  const users = store.getAllUsers();
  const enriched = users.map((user) => ({ ...user, roles: store.getRolesForUser(user.id) }));

  return (
    <div>
      <PageHeader
        title="Effective Permissions"
        description="Select a user to see their resolved permissions — the union of all roles they hold, with attribution showing which role grants each permission."
      />
      {enriched.length === 0 ? (
        <EmptyState icon={<Key className="h-7 w-7" />} title="No users to inspect" description="Add users to your workspace to audit their permissions here." />
      ) : (
        <PermissionExplorer users={enriched} defaultUserId={defaultUserId ?? enriched[0]?.id} />
      )}
    </div>
  );
}