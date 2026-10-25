import type { UserRole } from "@/types/account";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}
