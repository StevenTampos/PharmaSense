import { readAccounts, replaceAccounts, updateAccount } from "@/mocks/mockAccountStore";
import { apiRequest } from "@/services/apiClient";
import { mapBackendRoleToFrontend } from "@/services/authService";
import type { Account, AccountStatus, UserRole } from "@/types/account";
import type { ApiResponse } from "@/types/api";

export const MOCK_ADD_FAILURE_EMAIL_MARKER = "mock-fail";

export interface NewAccountDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  password?: string;
}

interface BackendUser {
  id: number | string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
}

let accountIdSequence = 0;

export function mapFrontendRoleToBackend(role: UserRole): string {
  switch (role) {
    case "administrator":
      return "Administrator";
    case "cashier_pharmacist":
      return "Cashier/Pharmacist";
    case "inventory_manager":
      return "Inventory Manager";
  }
}

function toAccount(user: BackendUser): Account {
  return {
    id: String(user.id),
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    phone: user.phone,
    role: mapBackendRoleToFrontend(user.role),
    status: user.status.toLowerCase() === "active" ? "active" : "inactive",
  };
}

function createErrorResponse<T>(message: string): ApiResponse<T> {
  return { status: "error", data: null, message };
}

/**
 * Lists accounts from the backend API, falling back to mock store if offline.
 */
export async function listAccounts(): Promise<ApiResponse<Account[]>> {
  if (import.meta.env.VITE_USE_MOCK === "true") {
    return { status: "success", data: readAccounts(), message: "Accounts loaded." };
  }

  const response = await apiRequest<BackendUser[]>("/api/users");

  if (response.status === "success" && response.data) {
    return {
      status: "success",
      data: response.data.map(toAccount),
      message: response.message,
    };
  }

  if (response.isNetworkError) {
    console.warn("Backend API unreachable; falling back to local mock accounts.");
    return { status: "success", data: readAccounts(), message: "Accounts loaded (mock)." };
  }

  return { status: "error", data: null, message: response.message };
}

/**
 * Changes an account role via backend API, falling back to mock store if offline.
 */
export async function changeAccountRole(
  accountId: string,
  role: UserRole,
): Promise<ApiResponse<Account>> {
  if (import.meta.env.VITE_USE_MOCK === "true") {
    const updated = updateAccount(accountId, { role });
    if (!updated) return createErrorResponse("The account could not be found.");
    return { status: "success", data: updated, message: "Account role updated." };
  }

  const response = await apiRequest<BackendUser>(`/api/users/${accountId}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role: mapFrontendRoleToBackend(role) }),
  });

  if (response.status === "success" && response.data) {
    return {
      status: "success",
      data: toAccount(response.data),
      message: response.message,
    };
  }

  if (response.isNetworkError) {
    console.warn("Backend API unreachable; updating mock account role.");
    const updated = updateAccount(accountId, { role });
    if (!updated) return createErrorResponse("The account could not be found.");
    return { status: "success", data: updated, message: "Account role updated." };
  }

  return { status: "error", data: null, message: response.message };
}

/**
 * Activates or deactivates an account via backend API, falling back to mock store if offline.
 */
export async function setAccountStatus(
  accountId: string,
  status: AccountStatus,
): Promise<ApiResponse<Account>> {
  if (import.meta.env.VITE_USE_MOCK === "true") {
    const updated = updateAccount(accountId, { status });
    if (!updated) return createErrorResponse("The account could not be found.");
    return { status: "success", data: updated, message: "Account status updated." };
  }

  const backendStatus = status === "active" ? "Active" : "Inactive";
  const response = await apiRequest<BackendUser>(`/api/users/${accountId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: backendStatus }),
  });

  if (response.status === "success" && response.data) {
    return {
      status: "success",
      data: toAccount(response.data),
      message: response.message,
    };
  }

  if (response.isNetworkError) {
    console.warn("Backend API unreachable; updating mock account status.");
    const updated = updateAccount(accountId, { status });
    if (!updated) return createErrorResponse("The account could not be found.");
    return { status: "success", data: updated, message: "Account status updated." };
  }

  return { status: "error", data: null, message: response.message };
}

/**
 * Adds an account via backend API, falling back to mock store if offline.
 */
export async function addAccount(details: NewAccountDetails): Promise<ApiResponse<Account>> {
  if (import.meta.env.VITE_USE_MOCK === "true") {
    return mockAddAccount(details);
  }

  // Format phone number to numeric digits to satisfy backend validator
  const cleanPhone = details.phone.replace(/\D/g, "");

  const response = await apiRequest<BackendUser>("/api/users", {
    method: "POST",
    body: JSON.stringify({
      first_name: details.firstName.trim(),
      last_name: details.lastName.trim(),
      email: details.email.trim(),
      phone: cleanPhone || details.phone.trim(),
      role: mapFrontendRoleToBackend(details.role),
      password: details.password || "PharmaSense123!",
    }),
  });

  if (response.status === "success" && response.data) {
    return {
      status: "success",
      data: toAccount(response.data),
      message: response.message,
    };
  }

  if (response.isNetworkError) {
    console.warn("Backend API unreachable; creating mock account.");
    return mockAddAccount(details);
  }

  return { status: "error", data: null, message: response.message };
}

function mockAddAccount(details: NewAccountDetails): ApiResponse<Account> {
  if (details.email.toLowerCase().includes(MOCK_ADD_FAILURE_EMAIL_MARKER)) {
    return createErrorResponse("The mock account service failed to add this account.");
  }

  const isDuplicateEmail = readAccounts().some(
    (account) => account.email.toLowerCase() === details.email.trim().toLowerCase(),
  );

  if (isDuplicateEmail) {
    return createErrorResponse("An account with this email is already registered.");
  }

  accountIdSequence += 1;
  const account: Account = {
    id: `mock-account-new-${Date.now()}-${accountIdSequence}`,
    firstName: details.firstName.trim(),
    lastName: details.lastName.trim(),
    email: details.email.trim(),
    phone: details.phone.trim(),
    role: details.role,
    status: "active",
  };

  const existingAccounts = readAccounts();
  existingAccounts.push(account);
  replaceAccounts(existingAccounts);

  return { status: "success", data: account, message: "Account added." };
}
