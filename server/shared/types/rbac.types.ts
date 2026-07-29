export type UserRole = 'Owner' | 'Admin' | 'Campaign Manager' | 'Analyst';

export type PermissionKey =
  | 'campaign:create'
  | 'campaign:edit'
  | 'campaign:dispatch'
  | 'campaign:delete'
  | 'domain:view'
  | 'domain:manage'
  | 'domain:verify'
  | 'workspace:settings'
  | 'members:invite'
  | 'members:manage_roles'
  | 'metrics:view'
  | 'suppressions:manage';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  tenantId: string;
  createdAt: string;
}