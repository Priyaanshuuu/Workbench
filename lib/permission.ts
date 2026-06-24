import type { Role, User, ResourceKey, ResolvedPermission, UserResolvedPermissions } from "./types";
import { PERMISSION_MAP, RESOURCES } from "./constants";

export function resolvePermissions(
  roles: Role[]
): Map<string, { roleId: string; roleName: string; roleColor: string }[]> {
  const permissionMap = new Map<
    string,
    { roleId: string; roleName: string; roleColor: string }[]
  >();
  
  for (const role of roles) {
    for (const permission of role.permissions) {
      const existing = permissionMap.get(permission) ?? [];
      if (!existing.some((e) => e.roleId === role.id)) {
        permissionMap.set(permission, [
          ...existing,
          { roleId: role.id, roleName: role.name, roleColor: role.color },
        ]);
      }
    }
  }
  return permissionMap;
}

export function buildUserResolvedPermissions(
  user: User,
  roles: Role[]
): UserResolvedPermissions {
  const permissionMap = resolvePermissions(roles);
  const resolvedPermissions: ResolvedPermission[] = [];

  for (const resource of RESOURCES) {
    for (const action of resource.actions) {
      const grantedBy = permissionMap.get(action.permission);
      if (grantedBy && grantedBy.length > 0) {
        resolvedPermissions.push({
          permission: action.permission,
          resource: resource.key,
          resourceLabel: resource.label,
          action: action.key,
          actionLabel: action.label,
          grantedBy,
        });
      }
    }
  }

  const byResource: Partial<Record<ResourceKey, ResolvedPermission[]>> = {};
  for (const rp of resolvedPermissions) {
    if (!byResource[rp.resource]) byResource[rp.resource] = [];
    byResource[rp.resource]!.push(rp);
  }

  return {
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    userInitials: user.initials,
    userAvatarColor: user.avatarColor,
    roles,
    resolvedPermissions,
    byResource,
    totalPermissions: resolvedPermissions.length,
  };
}

export function hasPermission(roles: Role[], permission: string): boolean {
  return roles.some((role) => role.permissions.includes(permission));
}

export function getPermissionLabel(permission: string): {
  resourceLabel: string;
  actionLabel: string;
} {
  const entry = PERMISSION_MAP[permission];
  if (!entry) return { resourceLabel: permission, actionLabel: "" };
  return { resourceLabel: entry.resource.label, actionLabel: entry.action.label };
}