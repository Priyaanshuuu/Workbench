"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, Trash2, AlertTriangle, X } from "lucide-react";
import type { Role } from "@/lib/types";
import { ROLE_COLORS, ROLE_COLOR_CLASSES } from "@/lib/constants";
import type { RoleColor } from "@/lib/constants";
import { PermissionMatrix } from "./PermissionMatrix";
import { cn } from "@/lib/utils";

interface RoleFormProps {
  role?: Role;
  mode: "create" | "edit";
}

export function RoleForm({ role, mode }: RoleFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(role?.name ?? "");
  const [description, setDescription] = useState(role?.description ?? "");
  const [permissions, setPermissions] = useState<string[]>(role?.permissions ?? []);
  const [color, setColor] = useState<RoleColor>((role?.color as RoleColor) ?? "blue");
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isSystem = role?.isSystem ?? false;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) { setError("Role name is required"); return; }
    if (!description.trim()) { setError("Description is required"); return; }

    startTransition(async () => {
      try {
        const url = mode === "create" ? "/api/roles" : `/api/roles/${role!.id}`;
        const method = mode === "create" ? "POST" : "PUT";
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, description, permissions, color }),
        });
        const json = await res.json();
        if (!res.ok) { setError(json.error ?? "Something went wrong"); return; }
        router.push("/roles");
        router.refresh();
      } catch {
        setError("Failed to save role. Please try again.");
      }
    });
  }

  async function handleDelete() {
    if (!role) return;
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/roles/${role.id}`, { method: "DELETE" });
        const json = await res.json();
        if (!res.ok) { setError(json.error ?? "Failed to delete role"); setShowDeleteConfirm(false); return; }
        router.push("/roles");
        router.refresh();
      } catch {
        setError("Failed to delete role. Please try again.");
        setShowDeleteConfirm(false);
      }
    });
  }

  return (
    <div className="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
            <button type="button" onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-900">Role Details</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Role Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Project Manager"
              disabled={isSystem}
              maxLength={64}
              className={cn(
                "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors",
                isSystem && "bg-gray-50 text-gray-500 cursor-not-allowed"
              )}
            />
            {isSystem && <p className="mt-1 text-xs text-gray-400">System role names cannot be changed.</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this role is for..."
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Badge Color</label>
            <div className="flex flex-wrap gap-2">
              {ROLE_COLORS.map((c) => {
                const cls = ROLE_COLOR_CLASSES[c];
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={cn(
                      "h-8 px-3 rounded-full text-xs font-semibold transition-all border-2",
                      cls.badge,
                      color === c ? "border-current scale-105 shadow-sm" : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Permissions</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {permissions.length === 0 ? "No permissions selected" : `${permissions.length} permission${permissions.length !== 1 ? "s" : ""} selected`}
              </p>
            </div>
            {permissions.length > 0 && (
              <button type="button" onClick={() => setPermissions([])} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                Clear all
              </button>
            )}
          </div>
          <PermissionMatrix selected={permissions} onChange={setPermissions} />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
            >
              <Save className="h-4 w-4" />
              {isPending ? (mode === "create" ? "Creating..." : "Saving...") : (mode === "create" ? "Create Role" : "Save Changes")}
            </button>
            <button
              type="button"
              onClick={() => router.push("/roles")}
              disabled={isPending}
              className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
          </div>

          {mode === "edit" && !isSystem && (
            <div>
              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Role
                </button>
              ) : (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5">
                  <span className="text-sm text-red-700 font-medium">Delete permanently?</span>
                  <button type="button" onClick={handleDelete} disabled={isPending} className="text-sm font-semibold text-red-600 hover:text-red-800 disabled:opacity-50 ml-1">
                    Yes, delete
                  </button>
                  <button type="button" onClick={() => setShowDeleteConfirm(false)} className="text-sm text-gray-500 hover:text-gray-700">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
          {mode === "edit" && isSystem && (
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5" />
              System roles cannot be deleted
            </p>
          )}
        </div>
      </form>
    </div>
  );
}