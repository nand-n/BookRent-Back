enum UserPermission {
    Create = "create-admin",
    Update = "update-admin",
    Delete = "delete-admin",
  }

export const Permission = {
  ...UserPermission,
};

export type PermissionType = UserPermission;