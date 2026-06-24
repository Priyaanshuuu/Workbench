import type { Resource, ResourceKey } from "./types";

export const RESOURCES: Resource[] = [
  {
    key: "projects",
    label: "Projects",
    description: "Manage project workspaces",
    actions: [
      { key: "view", label: "View", permission: "projects:view", description: "See projects and their contents" },
      { key: "create", label: "Create", permission: "projects:create", description: "Create new projects" },
      { key: "edit", label: "Edit", permission: "projects:edit", description: "Modify project details and settings" },
      { key: "delete", label: "Delete", permission: "projects:delete", description: "Permanently delete projects" },
      { key: "archive", label: "Archive", permission: "projects:archive", description: "Archive and unarchive projects" },
    ],
  },
  {
    key: "tasks",
    label: "Tasks",
    description: "Manage tasks within projects",
    actions: [
      { key: "view", label: "View", permission: "tasks:view", description: "See tasks and their details" },
      { key: "create", label: "Create", permission: "tasks:create", description: "Create new tasks" },
      { key: "edit", label: "Edit", permission: "tasks:edit", description: "Edit task details, status, and priority" },
      { key: "delete", label: "Delete", permission: "tasks:delete", description: "Permanently delete tasks" },
      { key: "assign", label: "Assign", permission: "tasks:assign", description: "Assign tasks to team members" },
    ],
  },
  {
    key: "members",
    label: "Members",
    description: "Manage team membership",
    actions: [
      { key: "view", label: "View", permission: "members:view", description: "See team member list and profiles" },
      { key: "invite", label: "Invite", permission: "members:invite", description: "Invite new members to the workspace" },
      { key: "remove", label: "Remove", permission: "members:remove", description: "Remove members from the workspace" },
      { key: "update_role", label: "Update Role", permission: "members:update_role", description: "Change roles assigned to members" },
    ],
  },
  {
    key: "billing",
    label: "Billing",
    description: "Manage subscription and payments",
    actions: [
      { key: "view", label: "View", permission: "billing:view", description: "See billing information and history" },
      { key: "update", label: "Update", permission: "billing:update", description: "Update payment methods and plans" },
      { key: "download_invoices", label: "Download Invoices", permission: "billing:download_invoices", description: "Download and export invoice PDFs" },
    ],
  },
  {
    key: "settings",
    label: "Settings",
    description: "Workspace configuration",
    actions: [
      { key: "view", label: "View", permission: "settings:view", description: "See workspace settings" },
      { key: "update", label: "Update", permission: "settings:update", description: "Modify workspace settings and preferences" },
    ],
  },
];

export const ALL_PERMISSIONS: string[] = RESOURCES.flatMap((r) =>
  r.actions.map((a) => a.permission)
);

export const RESOURCE_MAP: Record<ResourceKey, Resource> = RESOURCES.reduce(
  (acc, r) => ({ ...acc, [r.key]: r }),
  {} as Record<ResourceKey, Resource>
);

export const PERMISSION_MAP: Record
  string,
  { resource: Resource; action: (typeof RESOURCES)[0]["actions"][0] }
> = RESOURCES.reduce(
  (acc, resource) => {
    resource.actions.forEach((action) => {
      acc[action.permission] = { resource, action };
    });
    return acc;
  },
  {} as Record<string, { resource: Resource; action: (typeof RESOURCES)[0]["actions"][0] }>
);

export const ROLE_COLORS = [
  "violet", "blue", "emerald", "amber", "rose", "cyan", "indigo", "orange",
] as const;

export type RoleColor = (typeof ROLE_COLORS)[number];

export const ROLE_COLOR_CLASSES: Record
  RoleColor,
  { bg: string; text: string; border: string; badge: string }
> = {
  violet: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", badge: "bg-violet-100 text-violet-700" },
  blue:   { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200",   badge: "bg-blue-100 text-blue-700" },
  emerald:{ bg: "bg-emerald-50",text: "text-emerald-700",border: "border-emerald-200",badge: "bg-emerald-100 text-emerald-700" },
  amber:  { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  badge: "bg-amber-100 text-amber-700" },
  rose:   { bg: "bg-rose-50",   text: "text-rose-700",   border: "border-rose-200",   badge: "bg-rose-100 text-rose-700" },
  cyan:   { bg: "bg-cyan-50",   text: "text-cyan-700",   border: "border-cyan-200",   badge: "bg-cyan-100 text-cyan-700" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", badge: "bg-indigo-100 text-indigo-700" },
  orange: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", badge: "bg-orange-100 text-orange-700" },
};

export const AVATAR_COLORS = [
  "bg-violet-500","bg-blue-500","bg-emerald-500","bg-amber-500",
  "bg-rose-500","bg-cyan-500","bg-indigo-500","bg-orange-500",
] as const;