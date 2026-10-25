// Mock-backed authentication; will call POST /api/auth/login later.
import { readAccounts } from "@/mocks/mockAccountStore";
import type { Account } from "@/types/account";
import type { ApiResponse } from "@/types/api";
import type { AuthUser } from "@/types/auth";
import { isValidEmail } from "@/lib/validators";

const LOGIN_DELAY_MS = 350;
const INVALID_CREDENTIALS_MESSAGE = "Invalid email or password.";

function waitForLoginDelay(): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, LOGIN_DELAY_MS);
  });
}

function toAuthUser(account: Account): AuthUser {
  return {
    id: account.id,
    fullName: `${account.firstName} ${account.lastName}`,
    email: account.email,
    role: account.role,
  };
}

/**
 * Authenticates a mock account after a short delay.
 *
 * @param email - Account email address.
 * @param password - Password configured for this local mock.
 * @returns The matching user or an API-shaped error response.
 */
export async function login(email: string, password: string): Promise<ApiResponse<AuthUser>> {
  await waitForLoginDelay();

  const configuredPassword = import.meta.env.VITE_MOCK_LOGIN_PASSWORD;
  if (
    !configuredPassword ||
    !email.trim() ||
    !password ||
    !isValidEmail(email) ||
    password !== configuredPassword
  ) {
    return {
      status: "error",
      data: null,
      message: INVALID_CREDENTIALS_MESSAGE,
    };
  }

  const account = readAccounts().find(
    (currentAccount) => currentAccount.email.toLowerCase() === email.trim().toLowerCase(),
  );

  if (!account) {
    return {
      status: "error",
      data: null,
      message: INVALID_CREDENTIALS_MESSAGE,
    };
  }

  if (account.status === "inactive") {
    return {
      status: "error",
      data: null,
      message: "This account has been deactivated. Please contact the administrator.",
    };
  }

  return {
    status: "success",
    data: toAuthUser(account),
    message: "Login successful.",
  };
}
