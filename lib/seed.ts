import type { Role, User } from "./types";

export const SEED_ROLES: Role[] = [
  {
    id: "role-admin",
    name: "Admin",
    description: "Full access to all resources. Can manage roles, users, billing, and settings.",
    permissions: [
      "projects:view","projects:create","projects:edit","projects:delete","projects:archive",
      "tasks:view","tasks:create","tasks:edit","tasks:delete","tasks:assign",
      "members:view","members:invite","members:remove","members:update_role",
      "billing:view","billing:update","billing:download_invoices",
      "settings:view","settings:update",
    ],
    isSystem: true,
    color: "violet",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "role-member",
    name: "Member",
    description: "Standard team member. Can work on projects and tasks, view team members.",
    permissions: [
      "projects:view","projects:create","projects:edit",
      "tasks:view","tasks:create","tasks:edit","tasks:assign",
      "members:view",
      "settings:view",
    ],
    isSystem: true,
    color: "blue",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "role-viewer",
    name: "Viewer",
    description: "Read-only access. Can view projects, tasks, and team members but cannot make changes.",
    permissions: [
      "projects:view","tasks:view","members:view","settings:view",
    ],
    isSystem: true,
    color: "emerald",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "role-billing-manager",
    name: "Billing Manager",
    description: "Handles billing and invoices. Has member-level access plus full billing permissions.",
    permissions: [
      "projects:view","tasks:view","members:view",
      "billing:view","billing:update","billing:download_invoices",
      "settings:view",
    ],
    isSystem: false,
    color: "amber",
    createdAt: "2024-01-15T00:00:00.000Z",
    updatedAt: "2024-01-15T00:00:00.000Z",
  },
];

export const SEED_USERS: User[] = [
  {
    id: "user-alice",
    name: "Alice Chen",
    email: "alice@workbench.io",
    initials: "AC",
    avatarColor: "bg-violet-500",
    roleIds: ["role-admin"],
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "user-bob",
    name: "Bob Smith",
    email: "bob@workbench.io",
    initials: "BS",
    avatarColor: "bg-blue-500",
    roleIds: ["role-member", "role-billing-manager"], // multiple roles
    createdAt: "2024-01-05T00:00:00.000Z",
  },
  {
    id: "user-carol",
    name: "Carol White",
    email: "carol@workbench.io",
    initials: "CW",
    avatarColor: "bg-emerald-500",
    roleIds: ["role-member"],
    createdAt: "2024-01-10T00:00:00.000Z",
  },
  {
    id: "user-dan",
    name: "Dan Brown",
    email: "dan@workbench.io",
    initials: "DB",
    avatarColor: "bg-amber-500",
    roleIds: ["role-viewer"],
    createdAt: "2024-01-12T00:00:00.000Z",
  },
];