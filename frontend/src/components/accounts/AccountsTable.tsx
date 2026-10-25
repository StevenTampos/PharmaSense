import type { ReactElement } from "react";
import AccountRow from "@/components/accounts/AccountRow";
import EmptyState from "@/components/ui/EmptyState";
import type { Account, AccountStatus, UserRole } from "@/types/account";

interface AccountsTableProps {
  accounts: Account[];
  currentUserId: string;
  isActionLoading: boolean;
  onRequestRoleChange: (account: Account, role: UserRole) => void;
  onRequestStatusChange: (account: Account, status: AccountStatus) => void;
}

/**
 * Displays accounts in a horizontally scrollable, semantically structured table.
 *
 * @param props - Account rows and action handlers.
 * @returns The account table or its empty state.
 */
function AccountsTable({
  accounts,
  currentUserId,
  isActionLoading,
  onRequestRoleChange,
  onRequestStatusChange,
}: AccountsTableProps): ReactElement {
  if (accounts.length === 0) {
    return <EmptyState title="No accounts found" />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1050px] border-collapse text-left">
        <thead>
          <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-neutral-900 dark:text-slate-400">
            <th className="px-4 py-4" scope="col">
              Profile
            </th>
            <th className="px-4 py-4" scope="col">
              Username
            </th>
            <th className="px-4 py-4" scope="col">
              Email
            </th>
            <th className="px-4 py-4" scope="col">
              Role
            </th>
            <th className="px-4 py-4" scope="col">
              Phone No.
            </th>
            <th className="px-4 py-4" scope="col">
              Status
            </th>
            <th className="px-4 py-4" scope="col">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <AccountRow
              account={account}
              isActionLoading={isActionLoading}
              isOwnAccount={account.id === currentUserId}
              key={account.id}
              onRequestRoleChange={onRequestRoleChange}
              onRequestStatusChange={onRequestStatusChange}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AccountsTable;
