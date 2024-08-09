import { Role } from "../../users/enums/role.enum";
import { PermissionType } from "../autherization/permission.type";

export interface ActiveUserData {
  /** user id */
  sub: string;
  /** user email */
  email: string;
  /** user role */
  role: Role;
  /** user permissions */
  permissions: PermissionType[];
}