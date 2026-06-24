export type ResourceKey =
  | "projects"
  | "tasks"
  | "members"
  | "billing"
  | "settings";

export type Permission = string;

export interface Resource {
  key: ResourceKey;
  label: string;
  description: string;
  actions: Action[];
}

export interface RoleObject {
  roleId: string;
  roleName: string;
  roleColor: string;
}

export interface Action {
  key: string;
  label: string;
  permission: Permission;
  description: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem: boolean;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleInput {
  name: string;
  description: string;
  permissions: Permission[];
  color?: string;
}

export interface UpdateRoleInput {
  name?: string;
  description?: string;
  permissions?: Permission[];
  color?: string;
}


export interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarColor: string;
  roleIds: string[];
  createdAt: string;
}

export interface UserRoleInput {
  roleId: string;
}


export interface ResolvedPermission {
  permission: Permission;
  resource: ResourceKey;
  resourceLabel: string;
  action: string;
  actionLabel: string;
  grantedBy: Array<{
    roleId: string;
    roleName: string;
    roleColor: string;
  }>;
}

export interface UserResolvedPermissions {
  userId: string;
  userName: string;
  userEmail: string;
  userInitials: string;
  userAvatarColor: string;
  roles: Role[];
  resolvedPermissions: ResolvedPermission[];
  byResource: Partial<Record<ResourceKey, ResolvedPermission[]>>;
  totalPermissions: number;
}

export interface ApiSuccess<T> {
  data: T;
  error?: never;
}

export interface ApiError {
  data?: never;
  error: string;
  status?: number;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface GroupedPermissionEntry {
  permission: Permission;
  action: string;
  label: string;
  description: string;
}

export interface GroupedPermissions {
  resource: ResourceKey;
  label: string;
  description: string;
  permissions: GroupedPermissionEntry[];
}

export interface DashboardStats {
  totalRoles: number;
  totalUsers: number;
  totalResources: number;
  totalUniquePermissions: number;
  usersWithMultipleRoles: number;
  mostPermissiveRole: { name: string; count: number } | null;
}