import type { UserRole } from "@/types/account";
import { ROUTES } from "@/lib/routes";

export const ROLE_LABELS: Record<UserRole, string> = {
  administrator: "Administrator",
  cashier_pharmacist: "Cashier/Pharmacist",
  inventory_manager: "Inventory Manager",
};

export const ROLE_HOME_PATHS: Record<UserRole, string> = {
  administrator: ROUTES.adminDashboard,
  cashier_pharmacist: ROUTES.login,
  inventory_manager: ROUTES.login,
};

export const BUILT_DASHBOARD_ROLES = ["administrator"] as const;

/**
 * Returns the display label for a user role.
 *
 * @param role - Role to label.
 * @returns The role's display label.
 */
export function getRoleLabel(role: UserRole): string {
  return ROLE_LABELS[role];
}

/**
 * Returns the home path assigned to a user role.
 *
 * @param role - Role whose home path is requested.
 * @returns The role's home path.
 */
export function getHomePathForRole(role: UserRole): string {
  return ROLE_HOME_PATHS[role];
}

/**
 * Checks whether a role currently has a built dashboard.
 *
 * @param role - Role to check.
 * @returns Whether the role has a dashboard page.
 */
export function hasBuiltDashboard(role: UserRole): boolean {
  return role === BUILT_DASHBOARD_ROLES[0];
}
