import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { RoleForm } from "@/components/roles/RoleForm";

export default function NewRolePage() {
  return (
    <div>
      <Link href="/roles" className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
        <ChevronLeft className="h-4 w-4" />
        Back to Roles
      </Link>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Create Role</h1>
        <p className="mt-1 text-sm text-gray-500">Define a new role with specific permissions across resources.</p>
      </div>
      <RoleForm mode="create" />
    </div>
  );
}