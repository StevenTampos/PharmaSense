// Mock-backed account operations; these functions will call the backend API later.
import { readAccounts, replaceAccounts, updateAccount } from "@/mocks/mockAccountStore";
import type { Account, AccountStatus, UserRole } from "@/types/account";
import type { ApiResponse } from "@/types/api";

const ACCOUNT_SERVICE_DELAY_MS = 300;
export const MOCK_ADD_FAILURE_EMAIL_MARKER = "mock-fail";

export interface NewAccountDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
}

let accountIdSequence = 0;

function waitForAccountService(): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ACCOUNT_SERVICE_DELAY_MS);
  });
}

function createErrorResponse<T>(message: string): ApiResponse<T> {
  return { status: "error", data: null, message };
}

/**
 * Lists accounts from the shared in-memory mock store.
 *
 * @returns The API-shaped response containing accounts.
 */
export async function listAccounts(): Promise<ApiResponse<Account[]>> {
  await waitForAccountService();
  return {
    status: "success",
    data: readAccounts(),
    message: "Accounts loaded.",
  };
}

/**
 * Changes an account role in the shared in-memory mock store.
 *
 * @param accountId - ID of the account to update.
 * @param role - New account role.
 * @returns The updated account or an API-shaped error.
 */
export async function changeAccountRole(
  accountId: string,
  role: UserRole,
): Promise<ApiResponse<Account>> {
  await waitForAccountService();
  const account = updateAccount(accountId, { role });

  if (!account) {
    return createErrorResponse("The account could not be found.");
  }

  return { status: "success", data: account, message: "Account role updated." };
}

/**
 * Activates or deactivates an account in the shared in-memory mock store.
 *
 * @param accountId - ID of the account to update.
 * @param status - New account status.
 * @returns The updated account or an API-shaped error.
 */
export async function setAccountStatus(
  accountId: string,
  status: AccountStatus,
): Promise<ApiResponse<Account>> {
  await waitForAccountService();
  const account = updateAccount(accountId, { status });

  if (!account) {
    return createErrorResponse("The account could not be found.");
  }

  return { status: "success", data: account, message: "Account status updated." };
}

/**
 * Adds an active account without storing a password.
 *
 * @param details - Validated account details.
 * @returns The new account or an API-shaped error.
 */
export async function addAccount(details: NewAccountDetails): Promise<ApiResponse<Account>> {
  await waitForAccountService();

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
