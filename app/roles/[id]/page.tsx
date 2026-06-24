import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Lock } from "lucide-react";
import { store } from "@/lib/store";
import { RoleForm } from "@/components/roles/RoleForm";
import { RoleBadge } from "@/components/ui/RoleBadge";

export const dynamic = "force-dynamic";
type Params = { params: Promise<{ id: string }> };

export default async function EditRolePage({ params }: Params) {
  const { id } = await params;
  const role = store.getRoleById(id);
  if (!role) notFound();
  const users = store.getUsersForRole(id);

  return (
    <div>
      <Link href="/roles" className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
        <ChevronLeft className="h-4 w-4" />
        Back to Roles
      </Link>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Edit Role</h1>
            <RoleBadge name={role.name} color={role.color} />
            {role.isSystem && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                <Lock className="h-2.5 w-2.5" />
                System
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {users.length} {users.length === 1 ? "user has" : "users have"} this role · {role.permissions.length} permission{role.permissions.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
      <RoleForm role={role} mode="edit" />
    </div>
  );
}