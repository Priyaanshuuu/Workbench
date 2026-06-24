"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, ChevronDown, Loader2 } from "lucide-react";
import type { User, UserResolvedPermissions, Role } from "@/lib/types";
import { RESOURCES } from "@/lib/constants";
import { Avatar } from "@/components/ui/Avatar";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { cn } from "@/lib/utils";

interface PermissionExplorerProps {
  users: (User & { roles: Role[] })[];
  defaultUserId?: string;
}

export function PermissionExplorer({ users, defaultUserId }: PermissionExplorerProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>(defaultUserId ?? users[0]?.id ?? "");
  const [resolved, setResolved] = useState<UserResolvedPermissions | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedUser = users.find((u) => u.id === selectedUserId);

  const fetchResolved = useCallback(async (userId: string) => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/resolve/${userId}`);
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "Failed to load permissions"); setResolved(null); return; }
      setResolved(json.data);
    } catch {
      setError("Failed to load permissions");
      setResolved(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedUserId) fetchResolved(selectedUserId);
  }, [selectedUserId, fetchResolved]);

  return (
    <div className="space-y-6">
      {/* User selector */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Select User</label>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="w-full flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-left hover:border-violet-300 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            {selectedUser ? (
              <>
                <Avatar initials={selectedUser.initials} color={selectedUser.avatarColor} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{selectedUser.name}</p>
                  <p className="text-xs text-gray-500">{selectedUser.email}</p>
                </div>
                <div className="flex gap-1.5">
                  {selectedUser.roles.map((r) => <RoleBadge key={r.id} name={r.name} color={r.color} size="sm" />)}
                </div>
              </>
            ) : (
              <span className="text-sm text-gray-400">Select a user...</span>
            )}
            <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform ml-2 flex-shrink-0", dropdownOpen && "rotate-180")} />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 right-0 z-20 mt-1 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => { setSelectedUserId(user.id); setDropdownOpen(false); }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-violet-50 transition-colors border-b border-gray-50 last:border-0",
                    user.id === selectedUserId && "bg-violet-50"
                  )}
                >
                  <Avatar initials={user.initials} color={user.avatarColor} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <div className="flex gap-1.5 flex-wrap justify-end">
                    {user.roles.map((r) => <RoleBadge key={r.id} name={r.name} color={r.color} size="sm" />)}
                    {user.roles.length === 0 && <span className="text-xs text-gray-400 italic">No roles</span>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
          <span className="ml-3 text-sm text-gray-500">Resolving permissions...</span>
        </div>
      )}

      {error && !loading && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {!loading && !error && resolved && (
        <>
          {/* Summary bar */}
          <div className="flex items-center gap-3 rounded-xl border border-violet-200 bg-violet-50 px-5 py-3">
            <Avatar initials={resolved.userInitials} color={resolved.userAvatarColor} size="sm" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-violet-900">{resolved.userName}</p>
              <p className="text-xs text-violet-600">
                {resolved.roles.length === 0
                  ? "No roles assigned"
                  : `${resolved.roles.length} role${resolved.roles.length !== 1 ? "s" : ""} → ${resolved.totalPermissions} effective permission${resolved.totalPermissions !== 1 ? "s" : ""} (UNION)`}
              </p>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {resolved.roles.map((r) => <RoleBadge key={r.id} name={r.name} color={r.color} size="sm" />)}
            </div>
          </div>

          {resolved.totalPermissions === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 bg-white py-16 text-center">
              <Search className="h-8 w-8 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-500">No permissions</p>
              <p className="text-xs text-gray-400 mt-1">Assign a role to grant permissions.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-12 gap-3 bg-gray-50 px-5 py-3 border-b border-gray-200">
                <div className="col-span-2"><span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Resource</span></div>
                <div className="col-span-2"><span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Action</span></div>
                <div className="col-span-4"><span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Permission Key</span></div>
                <div className="col-span-4"><span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Granted By</span></div>
              </div>

              {RESOURCES.map((resource) => {
                const resourcePerms = resolved.byResource[resource.key] ?? [];
                const rows = resource.actions.map((action) => ({
                  action,
                  granted: resourcePerms.find((p) => p.action === action.key) ?? null,
                }));

                return (
                  <div key={resource.key} className="border-b border-gray-100 last:border-0">
                    {rows.map(({ action, granted }, rowIdx) => (
                      <div
                        key={action.key}
                        className={cn(
                          "grid grid-cols-12 gap-3 px-5 py-2.5 items-center transition-colors",
                          granted ? "hover:bg-emerald-50/50" : "opacity-40",
                          rowIdx !== rows.length - 1 && "border-b border-gray-50"
                        )}
                      >
                        <div className="col-span-2">
                          {rowIdx === 0 && (
                            <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
                              {resource.label}
                            </span>
                          )}
                        </div>
                        <div className="col-span-2">
                          <span className="text-sm text-gray-700 font-medium">{action.label}</span>
                        </div>
                        <div className="col-span-4">
                          <code className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                            {action.permission}
                          </code>
                        </div>
                        <div className="col-span-4">
                          {granted ? (
                            <div className="flex flex-wrap gap-1">
                              {granted.grantedBy.map((g) => <RoleBadge key={g.roleId} name={g.roleName} color={g.roleColor} size="sm" />)}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-300">—</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}