export type UserRole = "administrator" | "cashier_pharmacist" | "inventory_manager";

export type AccountStatus = "active" | "inactive";

export interface Account {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: AccountStatus;
}
