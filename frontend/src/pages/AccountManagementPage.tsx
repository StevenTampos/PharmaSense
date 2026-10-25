import { useState } from "react";
import type { ReactElement } from "react";
import AccountFilter from "@/components/accounts/AccountFilter";
import AccountSearchBar from "@/components/accounts/AccountSearchBar";
import AccountsTable from "@/components/accounts/AccountsTable";
import AddUserModal from "@/components/accounts/AddUserModal";
import ConfirmDialog from "@/components/modal/ConfirmDialog";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import { useAccounts } from "@/hooks/useAccounts";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_LABELS } from "@/lib/roles";
import type { Account, AccountStatus, UserRole } from "@/types/account";

type PendingAction =
  | { type: "role"; account: Account; role: UserRole }
  | { type: "status"; account: Account; status: AccountStatus };

/**
 * Composes account search, filters, administration actions, and the account table.
 *
 * @returns The administrator account-management page.
 */
function AccountManagementPage(): ReactElement {
  const { user } = useAuth();
  const {
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
  } = useAccounts();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  function handleClearFilters(): void {
    setFilters({ role: "", status: "" });
  }

  async function handleConfirmAction(): Promise<void> {
    if (!pendingAction) {
      return;
    }

    if (pendingAction.type === "role") {
      await changeRole(pendingAction.account.id, pendingAction.role);
    } else {
      await changeStatus(pendingAction.account.id, pendingAction.status);
    }

    setPendingAction(null);
  }

  function getConfirmationMessage(action: PendingAction): string {
    const name = `${action.account.firstName} ${action.account.lastName}`;

    if (action.type === "role") {
      return `Are you sure you want to change ${name}'s role to ${ROLE_LABELS[action.role]}?`;
    }

    const statusAction = action.status === "inactive" ? "deactivate" : "activate";
    return `Are you sure you want to ${statusAction} ${name}'s account?`;
  }

  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between xl:flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Account Management
            </h1>
            <AccountSearchBar onChange={setSearchKeyword} value={searchKeyword} />
          </div>
          <div className="flex items-center justify-end gap-3">
            <AccountFilter
              isOpen={isFilterOpen}
              onClear={handleClearFilters}
              onRoleChange={(role) => setFilters({ ...filters, role })}
              onStatusChange={(status) => setFilters({ ...filters, status })}
              onToggle={() => setIsFilterOpen((currentValue) => !currentValue)}
              role={filters.role}
              status={filters.status}
            />
            <Button
              className="w-auto whitespace-nowrap px-4 py-3 text-sm"
              onClick={() => setIsAddUserOpen(true)}
            >
              Add user
            </Button>
          </div>
        </div>

        {actionError && <Alert>{actionError}</Alert>}
        {error ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
            <Alert>{error}</Alert>
            <Button
              className="mt-4 w-auto"
              disabled={isLoading}
              onClick={() => void loadAccounts()}
            >
              {isLoading ? "Loading..." : "Try again"}
            </Button>
          </section>
        ) : (
          <section
            aria-busy={isLoading}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
          >
            {isLoading ? (
              <div
                aria-live="polite"
                className="flex min-h-48 items-center justify-center text-sm text-slate-500 dark:text-slate-400"
                role="status"
              >
                Loading accounts...
              </div>
            ) : (
              <AccountsTable
                accounts={filteredAccounts}
                currentUserId={user?.id ?? ""}
                isActionLoading={isActionLoading}
                onRequestRoleChange={(account, role) =>
                  setPendingAction({ type: "role", account, role })
                }
                onRequestStatusChange={(account, status) =>
                  setPendingAction({ type: "status", account, status })
                }
              />
            )}
          </section>
        )}
      </div>

      {pendingAction && (
        <ConfirmDialog
          isConfirming={isActionLoading}
          message={getConfirmationMessage(pendingAction)}
          onCancel={() => setPendingAction(null)}
          onConfirm={() => {
            void handleConfirmAction();
          }}
          title="Confirm account change"
        />
      )}

      {isAddUserOpen && (
        <AddUserModal
          accounts={accounts}
          isSubmitting={isActionLoading}
          onAddAccount={addAccount}
          onClose={() => setIsAddUserOpen(false)}
        />
      )}
    </DashboardLayout>
  );
}

export default AccountManagementPage;
