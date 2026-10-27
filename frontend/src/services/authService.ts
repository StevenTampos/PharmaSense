import { readAccounts } from "@/mocks/mockAccountStore";
import { apiRequest, clearStoredSession, setStoredToken } from "@/services/apiClient";
import type { Account, UserRole } from "@/types/account";
import type { ApiResponse } from "@/types/api";
import type { AuthUser } from "@/types/auth";
import { isValidEmail } from "@/lib/validators";

const INVALID_CREDENTIALS_MESSAGE = "Invalid email or password.";

interface BackendUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
}

interface LoginPayload {
  token: string;
  user: BackendUser;
}

export function mapBackendRoleToFrontend(role: string): UserRole {
  switch (role) {
    case "Administrator":
      return "administrator";
    case "Cashier/Pharmacist":
      return "cashier_pharmacist";
    case "Inventory Manager":
      return "inventory_manager";
    default:
      return "cashier_pharmacist";
  }
}

function toAuthUserFromAccount(account: Account): AuthUser {
  return {
    id: account.id,
    fullName: `${account.firstName} ${account.lastName}`,
    email: account.email,
    role: account.role,
  };
}

function toAuthUserFromBackend(user: BackendUser): AuthUser {
  return {
    id: String(user.id),
    fullName: `${user.first_name} ${user.last_name}`,
    email: user.email,
    role: mapBackendRoleToFrontend(user.role),
  };
}

/**
 * Fallback in-memory authentication when the backend server is offline.
 */
function mockAuthenticate(email: string, password: string): ApiResponse<AuthUser> {
  const normalized = email.trim().toLowerCase();

  // Test login shortcut: admin / admin123
  if (
    (normalized === "admin" || normalized === "admin@pharmasense.local") &&
    password === "admin123"
  ) {
    const adminAccount = readAccounts().find((a) => a.role === "administrator") ?? {
      id: "mock-account-001",
      firstName: "Admin",
      lastName: "User",
      email: "admin@pharmasense.local",
      phone: "09171234567",
      role: "administrator" as const,
      status: "active" as const,
    };
    const user = toAuthUserFromAccount(adminAccount);
    return { status: "success", data: user, message: "Login successful." };
  }

  const configuredPassword = import.meta.env.VITE_MOCK_LOGIN_PASSWORD;
  if (!configuredPassword || password !== configuredPassword) {
    return { status: "error", data: null, message: INVALID_CREDENTIALS_MESSAGE };
  }

  const account = readAccounts().find((current) => current.email.toLowerCase() === normalized);

  if (!account) {
    return { status: "error", data: null, message: INVALID_CREDENTIALS_MESSAGE };
  }

  if (account.status === "inactive") {
    return {
      status: "error",
      data: null,
      message: "This account has been deactivated. Please contact the administrator.",
    };
  }

  const user = toAuthUserFromAccount(account);
  return { status: "success", data: user, message: "Login successful." };
}

/**
 * Authenticates user credentials via backend API, with graceful fallback to mock store.
 */
export async function login(email: string, password: string): Promise<ApiResponse<AuthUser>> {
  const isAcceptedIdentifier = isValidEmail(email) || email.trim().toLowerCase() === "admin";
  if (!email.trim() || !password || !isAcceptedIdentifier) {
    return { status: "error", data: null, message: INVALID_CREDENTIALS_MESSAGE };
  }

  // If mock mode explicitly enabled, skip backend
  if (import.meta.env.VITE_USE_MOCK === "true") {
    return mockAuthenticate(email, password);
  }

  // Attempt backend API login
  const response = await apiRequest<LoginPayload>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: email.trim(), password }),
  });

  if (response.status === "success" && response.data) {
    setStoredToken(response.data.token);
    const user = toAuthUserFromBackend(response.data.user);
    return { status: "success", data: user, message: response.message };
  }

  // If backend was unreachable, fall back to mock authentication
  if (response.isNetworkError) {
    console.warn("Backend API unreachable; falling back to local mock authentication.");
    return mockAuthenticate(email, password);
  }

  return { status: "error", data: null, message: response.message };
}

/**
 * Logs out the current user and clears stored session.
 */
export async function logout(): Promise<void> {
  try {
    await apiRequest("/api/auth/logout", { method: "POST" });
  } catch {
    // Ignore network error on logout
  } finally {
    clearStoredSession();
  }
}
