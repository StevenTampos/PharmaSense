import { MOCK_ACCOUNTS } from "@/mocks/mockAccounts";
import type { Account } from "@/types/account";

let accounts = MOCK_ACCOUNTS.map((account) => ({ ...account }));

/**
 * Reads a copy of all accounts from the shared in-memory mock store.
 *
 * @returns A copy of the stored accounts.
 */
export function readAccounts(): Account[] {
  return accounts.map((account) => ({ ...account }));
}

/**
 * Replaces every account in the shared in-memory mock store.
 *
 * @param nextAccounts - Accounts to store.
 * @returns Nothing.
 */
export function replaceAccounts(nextAccounts: readonly Account[]): void {
  accounts = nextAccounts.map((account) => ({ ...account }));
}

/**
 * Updates an account in the shared in-memory mock store.
 *
 * @param accountId - ID of the account to update.
 * @param updates - Account properties to replace.
 * @returns The updated account, or null if it was not found.
 */
export function updateAccount(
  accountId: string,
  updates: Partial<Omit<Account, "id">>,
): Account | null {
  const accountIndex = accounts.findIndex((account) => account.id === accountId);

  if (accountIndex === -1) {
    return null;
  }

  const currentAccount = accounts[accountIndex];
  const updatedAccount = { ...currentAccount, ...updates };
  accounts = accounts.map((account, index) => (index === accountIndex ? updatedAccount : account));

  return { ...updatedAccount };
}
