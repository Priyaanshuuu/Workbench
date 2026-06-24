"use client";

import { RESOURCES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface PermissionMatrixProps {
  selected: string[];
  onChange: (permissions: string[]) => void;
  disabled?: boolean;
}

export function PermissionMatrix({ selected, onChange, disabled = false }: PermissionMatrixProps) {
  const selectedSet = new Set(selected);

  function toggle(permission: string) {
    if (disabled) return;
    const next = new Set(selectedSet);
    next.has(permission) ? next.delete(permission) : next.add(permission);
    onChange(Array.from(next));
  }

  function toggleResource(resourceKey: string) {
    if (disabled) return;
    const resource = RESOURCES.find((r) => r.key === resourceKey);
    if (!resource) return;
    const resourcePermissions = resource.actions.map((a) => a.permission);
    const allSelected = resourcePermissions.every((p) => selectedSet.has(p));
    const next = new Set(selectedSet);
    if (allSelected) {
      resourcePermissions.forEach((p) => next.delete(p));
    } else {
      resourcePermissions.forEach((p) => next.add(p));
    }
    onChange(Array.from(next));
  }

  function toggleAll() {
    if (disabled) return;
    const allPermissions = RESOURCES.flatMap((r) => r.actions.map((a) => a.permission));
    const allSelected = allPermissions.every((p) => selectedSet.has(p));
    onChange(allSelected ? [] : allPermissions);
  }

  const allPermissions = RESOURCES.flatMap((r) => r.actions.map((a) => a.permission));
  const allSelected = allPermissions.every((p) => selectedSet.has(p));
  const someSelected = selectedSet.size > 0 && !allSelected;

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 border-b border-gray-200">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={allSelected}
            ref={(el) => { if (el) el.indeterminate = someSelected; }}
            onChange={toggleAll}
            disabled={disabled}
            className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500 cursor-pointer disabled:cursor-not-allowed"
          />
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">Resource</span>
        </label>
        <span className="ml-auto text-xs text-gray-400">
          {selectedSet.size} / {allPermissions.length} selected
        </span>
      </div>

      {/* Resources */}
      {RESOURCES.map((resource, idx) => {
        const resourcePermissions = resource.actions.map((a) => a.permission);
        const allResourceSelected = resourcePermissions.every((p) => selectedSet.has(p));
        const someResourceSelected = resourcePermissions.some((p) => selectedSet.has(p)) && !allResourceSelected;

        return (
          <div key={resource.key} className={cn("px-4 py-4", idx !== RESOURCES.length - 1 && "border-b border-gray-100")}>
            <label className="flex items-center gap-2.5 cursor-pointer select-none mb-3">
              <input
                type="checkbox"
                checked={allResourceSelected}
                ref={(el) => { if (el) el.indeterminate = someResourceSelected; }}
                onChange={() => toggleResource(resource.key)}
                disabled={disabled}
                className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500 cursor-pointer disabled:cursor-not-allowed"
              />
              <div>
                <span className="text-sm font-semibold text-gray-800">{resource.label}</span>
                <span className="ml-2 text-xs text-gray-400">{resource.description}</span>
              </div>
            </label>

            <div className="ml-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {resource.actions.map((action) => {
                const isChecked = selectedSet.has(action.permission);
                return (
                  <label
                    key={action.key}
                    className={cn(
                      "flex items-start gap-2 rounded-lg border p-2.5 cursor-pointer transition-colors select-none",
                      isChecked ? "border-violet-200 bg-violet-50" : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50",
                      disabled && "cursor-not-allowed opacity-60"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggle(action.permission)}
                      disabled={disabled}
                      className="mt-0.5 h-3.5 w-3.5 rounded border-gray-300 text-violet-600 focus:ring-violet-500 cursor-pointer disabled:cursor-not-allowed flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-700 leading-tight">{action.label}</p>
                      <p className="mt-0.5 text-[10px] text-gray-400 leading-tight">{action.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}