import { ROLE_LABELS } from "@/lib/roles";
import type { Account } from "@/types/account";

/**
 * Builds the case-insensitive text searched for an account row.
 *
 * @param account - Account to make searchable.
 * @returns The account's searchable fields joined and lowercased.
 */
export function getAccountSearchText(account: Account): string {
  return [
    account.firstName,
    account.lastName,
    account.email,
    account.role.replaceAll("_", " "),
    ROLE_LABELS[account.role],
    account.phone,
  ]
    .join(" ")
    .toLowerCase();
}

/**
 * Adds a new account or replaces the matching account in a list.
 *
 * @param accounts - Current account list.
 * @param updatedAccount - Account returned by the service.
 * @returns A new account list with the account added or updated.
 */
export function upsertAccount(accounts: readonly Account[], updatedAccount: Account): Account[] {
  const accountExists = accounts.some((account) => account.id === updatedAccount.id);
  return accountExists
    ? accounts.map((account) => (account.id === updatedAccount.id ? updatedAccount : account))
    : [...accounts, updatedAccount];
}
