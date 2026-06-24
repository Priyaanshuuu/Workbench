import type { Role, User, CreateRoleInput, UpdateRoleInput } from "./types";
import { SEED_ROLES, SEED_USERS } from "./seed";

function createStore() {
  const roles = new Map<string, Role>(
    SEED_ROLES.map((r) => [r.id, { ...r, permissions: [...r.permissions] }])
  );
  const users = new Map<string, User>(
    SEED_USERS.map((u) => [u.id, { ...u, roleIds: [...u.roleIds] }])
  );

  function getAllRoles(): Role[] {
    return Array.from(roles.values()).sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  function getRoleById(id: string): Role | null {
    return roles.get(id) ?? null;
  }

  function createRole(input: CreateRoleInput): Role {
    const id = `role-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const now = new Date().toISOString();
    const role: Role = {
      id,
      name: input.name.trim(),
      description: input.description.trim(),
      permissions: [...new Set(input.permissions)],
      isSystem: false,
      color: input.color ?? "blue",
      createdAt: now,
      updatedAt: now,
    };
    roles.set(id, role);
    return role;
  }

  function updateRole(id: string, input: UpdateRoleInput): Role | null {
    const existing = roles.get(id);
    if (!existing) return null;
    const updated: Role = {
      ...existing,
      ...(input.name !== undefined && { name: input.name.trim() }),
      ...(input.description !== undefined && { description: input.description.trim() }),
      ...(input.permissions !== undefined && { permissions: [...new Set(input.permissions)] }),
      ...(input.color !== undefined && { color: input.color }),
      updatedAt: new Date().toISOString(),
    };
    roles.set(id, updated);
    return updated;
  }

  function deleteRole(id: string): { success: boolean; error?: string } {
    const role = roles.get(id);
    if (!role) return { success: false, error: "Role not found" };
    if (role.isSystem) return { success: false, error: "System roles cannot be deleted" };
    roles.delete(id);
    users.forEach((user) => {
      if (user.roleIds.includes(id)) {
        user.roleIds = user.roleIds.filter((rid) => rid !== id);
      }
    });
    return { success: true };
  }

  function getAllUsers(): User[] {
    return Array.from(users.values()).sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  function getUserById(id: string): User | null {
    return users.get(id) ?? null;
  }

  function assignRole(userId: string, roleId: string): { user: User | null; error?: string } {
    const user = users.get(userId);
    if (!user) return { user: null, error: "User not found" };
    const role = roles.get(roleId);
    if (!role) return { user: null, error: "Role not found" };
    if (!user.roleIds.includes(roleId)) {
      user.roleIds = [...user.roleIds, roleId];
    }
    return { user };
  }

  function unassignRole(userId: string, roleId: string): { user: User | null; error?: string } {
    const user = users.get(userId);
    if (!user) return { user: null, error: "User not found" };
    user.roleIds = user.roleIds.filter((rid) => rid !== roleId);
    return { user };
  }

  function getRolesForUser(userId: string): Role[] {
    const user = users.get(userId);
    if (!user) return [];
    return user.roleIds
      .map((rid) => roles.get(rid))
      .filter((r): r is Role => r !== undefined);
  }

  function getUsersForRole(roleId: string): User[] {
    return Array.from(users.values()).filter((u) => u.roleIds.includes(roleId));
  }

  return {
    getAllRoles, getRoleById, createRole, updateRole, deleteRole,
    getAllUsers, getUserById, assignRole, unassignRole,
    getRolesForUser, getUsersForRole,
  };
}

const globalForStore = globalThis as unknown as {
  __workbenchStore?: ReturnType<typeof createStore>;
};
if (!globalForStore.__workbenchStore) {
  globalForStore.__workbenchStore = createStore();
}
export const store = globalForStore.__workbenchStore;