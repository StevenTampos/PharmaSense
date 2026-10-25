export type UserRole = "Administrator" | "Cashier/Pharmacist" | "Inventory Manager";

export type UserStatus = "Active" | "Inactive";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: UserRole;
  password_hash: string;
  profile_pic: string | null;
  status: UserStatus;
  created_at: Date;
  updated_at: Date;
}

export type SafeUser = Omit<User, "password_hash">;

export type AuditLogAction =
  | "LOGIN"
  | "LOGIN_FAILED"
  | "LOGIN_BLOCKED"
  | "LOGOUT"
  | "CREATE_USER"
  | "ACTIVATE_USER"
  | "DEACTIVATE_USER"
  | "PASSWORD_CHANGE";

export type AuditLogModule = "Authentication" | "Account Management" | "Inventory" | "POS";

export interface AuditLog {
  id: number;
  user_id: number | null;
  action: AuditLogAction | string;
  module: AuditLogModule | string;
  record_id: string | null;
  description: string;
  ip_address: string | null;
  device: string | null;
  created_at: Date;
}

export interface ApiResponse<T = unknown> {
  status: "success" | "error";
  data?: T;
  message?: string;
}

export interface AuthTokenPayload {
  id: number;
  email: string;
  role: UserRole;
}
