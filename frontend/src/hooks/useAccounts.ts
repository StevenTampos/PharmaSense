import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addAccount as addAccountRequest,
  changeAccountRole,
  listAccounts,
  setAccountStatus,
} from "@/services/accountService";
import type { NewAccountDetails } from "@/services/accountService";
import { getAccountSearchText, upsertAccount } from "@/lib/accounts";
import type { Account, AccountStatus, UserRole } from "@/types/account";
import type { ApiResponse } from "@/types/api";

interface AccountFilters {
  role: UserRole | "";
  status: AccountStatus | "";
}

interface UseAccountsResult {
  accounts: Account[];
  filteredAccounts: Account[];
  isLoading: boolean;
  isActionLoading: boolean;
  error: string | null;
  actionError: string | null;
  searchKeyword: string;
  filters: AccountFilters;
  setSearchKeyword: (keyword: string) => void;
  setFilters: (filters: AccountFilters) => void;
  loadAccounts: () => Promise<void>;
  changeRole: (accountId: string, role: UserRole) => Promise<ApiResponse<Account>>;
  changeStatus: (accountId: string, status: AccountStatus) => Promise<ApiResponse<Account>>;
  addAccount: (details: NewAccountDetails) => Promise<ApiResponse<Account>>;
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

/**
 * Loads, filters, and updates accounts through the mock-backed account service.
 *
 * @returns Account data, UI state, filters, and account actions.
 */
export function useAccounts(): UseAccountsResult {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filters, setFilters] = useState<AccountFilters>({ role: "", status: "" });

  const loadAccounts = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await listAccounts();
      if (response.status === "error" || !response.data) {
        setError(response.message);
        return;
      }
      setAccounts(response.data);
    } catch (caughtError: unknown) {
      setError(getErrorMessage(caughtError, "Unable to load accounts. Please try again."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAccounts();
  }, [loadAccounts]);

  const filteredAccounts = useMemo(() => {
    const normalizedKeyword = searchKeyword.trim().toLowerCase();

    return accounts.filter((account) => {
      const searchableText = getAccountSearchText(account);

      return (
        (!normalizedKeyword || searchableText.includes(normalizedKeyword)) &&
        (!filters.role || account.role === filters.role) &&
        (!filters.status || account.status === filters.status)
      );
    });
  }, [accounts, filters, searchKeyword]);

  async function runAccountAction(
    request: () => Promise<ApiResponse<Account>>,
    fallbackMessage: string,
    showActionError: boolean = true,
  ): Promise<ApiResponse<Account>> {
    setIsActionLoading(true);
    setActionError(null);

    try {
      const response = await request();
      if (response.status === "error" || !response.data) {
        if (showActionError) {
          setActionError(response.message);
        }
        return response;
      }

      const updatedAccount = response.data;
      setAccounts((currentAccounts) => upsertAccount(currentAccounts, updatedAccount));
      return response;
    } catch (caughtError: unknown) {
      const message = getErrorMessage(caughtError, fallbackMessage);
      if (showActionError) {
        setActionError(message);
      }
      return { status: "error", data: null, message };
    } finally {
      setIsActionLoading(false);
    }
  }

  function changeRole(accountId: string, role: UserRole): Promise<ApiResponse<Account>> {
    return runAccountAction(
      () => changeAccountRole(accountId, role),
      "Unable to update the account role. Please try again.",
    );
  }

  function changeStatus(accountId: string, status: AccountStatus): Promise<ApiResponse<Account>> {
    return runAccountAction(
      () => setAccountStatus(accountId, status),
      "Unable to update the account status. Please try again.",
    );
  }

  function addAccount(details: NewAccountDetails): Promise<ApiResponse<Account>> {
    return runAccountAction(
      () => addAccountRequest(details),
      "Unable to add the account. Please try again.",
      false,
    );
  }

  return {
    accounts,
    filteredAccounts,
    isLoading,
    isActionLoading,
    error,
    actionError,
    searchKeyword,
    filters,
    setSearchKeyword,
    setFilters,
    loadAccounts,
    changeRole,
    changeStatus,
    addAccount,
  };
}
