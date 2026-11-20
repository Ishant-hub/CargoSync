export enum Permission {
  // User permissions
  USER_READ_SELF = 'user:read:self',
  USER_UPDATE_SELF = 'user:update:self',
  USER_VERIFY = 'user:verify',

  // Company permissions
  COMPANY_CREATE = 'company:create',
  COMPANY_READ = 'company:read',
  COMPANY_UPDATE = 'company:update',
  COMPANY_VERIFY = 'company:verify',
  COMPANY_MANAGE_TEAM = 'company:manage:team',

  // Invitation permissions
  INVITATION_CREATE = 'invitation:create',
  INVITATION_REVOKE = 'invitation:revoke',
  INVITATION_ACCEPT = 'invitation:accept',

  // Fleet & operations (scaffolding for future phases)
  FLEET_READ = 'fleet:read',
  FLEET_MANAGE = 'fleet:manage',
  SHIPMENT_CREATE = 'shipment:create',
  SHIPMENT_VIEW = 'shipment:view',
  JOB_ACCEPT = 'job:accept',
}

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  SHIPPER: [
    Permission.USER_READ_SELF,
    Permission.USER_UPDATE_SELF,
    Permission.SHIPMENT_CREATE,
    Permission.SHIPMENT_VIEW,
    Permission.COMPANY_READ,
    Permission.INVITATION_ACCEPT,
  ],
  DRIVER: [
    Permission.USER_READ_SELF,
    Permission.USER_UPDATE_SELF,
    Permission.JOB_ACCEPT,
    Permission.COMPANY_READ,
    Permission.INVITATION_ACCEPT,
  ],
  FLEET_MANAGER: [
    Permission.USER_READ_SELF,
    Permission.USER_UPDATE_SELF,
    Permission.FLEET_READ,
    Permission.FLEET_MANAGE,
    Permission.COMPANY_READ,
    Permission.INVITATION_ACCEPT,
  ],
  COMPANY_ADMIN: [
    Permission.USER_READ_SELF,
    Permission.USER_UPDATE_SELF,
    Permission.COMPANY_CREATE,
    Permission.COMPANY_READ,
    Permission.COMPANY_UPDATE,
    Permission.COMPANY_MANAGE_TEAM,
    Permission.INVITATION_CREATE,
    Permission.INVITATION_REVOKE,
    Permission.INVITATION_ACCEPT,
    Permission.FLEET_READ,
    Permission.FLEET_MANAGE,
    Permission.SHIPMENT_VIEW,
  ],
  PLATFORM_ADMIN: [
    Permission.USER_READ_SELF,
    Permission.USER_UPDATE_SELF,
    Permission.USER_VERIFY,
    Permission.COMPANY_CREATE,
    Permission.COMPANY_READ,
    Permission.COMPANY_UPDATE,
    Permission.COMPANY_VERIFY,
    Permission.COMPANY_MANAGE_TEAM,
    Permission.INVITATION_CREATE,
    Permission.INVITATION_REVOKE,
    Permission.INVITATION_ACCEPT,
    Permission.FLEET_READ,
    Permission.FLEET_MANAGE,
    Permission.SHIPMENT_VIEW,
  ],
};

export const COMPANY_ROLE_PERMISSIONS: Record<string, Permission[]> = {
  ADMIN: [
    Permission.COMPANY_READ,
    Permission.COMPANY_UPDATE,
    Permission.COMPANY_MANAGE_TEAM,
    Permission.INVITATION_CREATE,
    Permission.INVITATION_REVOKE,
    Permission.FLEET_READ,
    Permission.FLEET_MANAGE,
  ],
  DISPATCHER: [
    Permission.COMPANY_READ,
    Permission.FLEET_READ,
    Permission.SHIPMENT_VIEW,
  ],
  FLEET_MANAGER: [
    Permission.COMPANY_READ,
    Permission.FLEET_READ,
    Permission.FLEET_MANAGE,
  ],
  DRIVER: [
    Permission.COMPANY_READ,
    Permission.JOB_ACCEPT,
  ],
  MEMBER: [
    Permission.COMPANY_READ,
  ],
};

export function hasPermission(
  userRole: string,
  requiredPermission: Permission,
  companyRole?: string | null
): boolean {
  const rolePerms = ROLE_PERMISSIONS[userRole] || [];
  if (rolePerms.includes(requiredPermission)) {
    return true;
  }
  if (companyRole) {
    const compPerms = COMPANY_ROLE_PERMISSIONS[companyRole] || [];
    if (compPerms.includes(requiredPermission)) {
      return true;
    }
  }
  return false;
}
