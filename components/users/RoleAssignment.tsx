"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { Role } from "@/lib/types";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { cn } from "@/lib/utils";

interface RoleAssignmentProps {
  userId: string;
  assignedRoles: Role[];
  allRoles: Role[];
}

export function RoleAssignment({ userId, assignedRoles, allRoles }: RoleAssignmentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const assignedIds = new Set(assignedRoles.map((r) => r.id));
  const availableToAssign = allRoles.filter((r) => !assignedIds.has(r.id));

  function clearMessages() { setError(null); setSuccessMsg(null); }

  async function handleAssign(roleId: string, roleName: string) {
    clearMessages();
    startTransition(async () => {
      try {
        const res = await fetch(`/api/users/${userId}/roles`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roleId }),
        });
        const json = await res.json();
        if (!res.ok) { setError(json.error ?? "Failed to assign role"); return; }
        setSuccessMsg(`"${roleName}" role assigned`);
        setShowPicker(false);
        router.refresh();
        setTimeout(() => setSuccessMsg(null), 3000);
      } catch {
        setError("Failed to assign role. Please try again.");
      }
    });
  }

  async function handleUnassign(roleId: string, roleName: string) {
    clearMessages();
    startTransition(async () => {
      try {
        const res = await fetch(`/api/users/${userId}/roles`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roleId }),
        });
        const json = await res.json();
        if (!res.ok) { setError(json.error ?? "Failed to unassign role"); return; }
        setSuccessMsg(`"${roleName}" role removed`);
        router.refresh();
        setTimeout(() => setSuccessMsg(null), 3000);
      } catch {
        setError("Failed to unassign role. Please try again.");
      }
    });
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
          <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700 flex-1">{error}</p>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600"><X className="h-3.5 w-3.5" /></button>
        </div>
      )}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
          <p className="text-sm text-emerald-700">{successMsg}</p>
        </div>
      )}

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Assigned Roles</h3>
        {assignedRoles.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-200 py-6 px-4 text-center">
            <p className="text-sm text-gray-400">No roles assigned yet</p>
            <p className="text-xs text-gray-400 mt-1">Assign a role below to grant permissions</p>
          </div>
        ) : (
          <div className="space-y-2">
            {assignedRoles.map((role) => (
              <div key={role.id} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
                <RoleBadge name={role.name} color={role.color} />
                <p className="flex-1 text-xs text-gray-500 truncate">{role.description}</p>
                <span className="text-xs text-gray-400 mr-2">{role.permissions.length} perms</span>
                <button
                  onClick={() => handleUnassign(role.id, role.name)}
                  disabled={isPending}
                  className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-50 transition-colors"
                  title={`Remove ${role.name} role`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Assign Role</h3>
        {availableToAssign.length === 0 ? (
          <p className="text-sm text-gray-400 italic">All available roles have been assigned</p>
        ) : !showPicker ? (
          <button
            onClick={() => setShowPicker(true)}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50 disabled:opacity-50 transition-colors w-full justify-center"
          >
            <Plus className="h-4 w-4" />
            Assign a role
          </button>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
              <p className="text-xs font-semibold text-gray-600">Select a role to assign</p>
              <button onClick={() => setShowPicker(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {availableToAssign.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleAssign(role.id, role.name)}
                  disabled={isPending}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-violet-50 disabled:opacity-50 transition-colors"
                >
                  <RoleBadge name={role.name} color={role.color} size="sm" />
                  <span className="flex-1 text-xs text-gray-500 line-clamp-1">{role.description}</span>
                  <span className="text-xs text-gray-400">{role.permissions.length} perms</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}