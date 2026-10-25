import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import RoleSelect from "@/components/accounts/RoleSelect";
import Avatar from "@/components/ui/Avatar";
import StatusBadge from "@/components/ui/StatusBadge";
import { ROLE_LABELS } from "@/lib/roles";
import type { Account, AccountStatus, UserRole } from "@/types/account";

interface AccountRowProps {
  account: Account;
  isOwnAccount: boolean;
  isActionLoading: boolean;
  onRequestRoleChange: (account: Account, role: UserRole) => void;
  onRequestStatusChange: (account: Account, status: AccountStatus) => void;
}

/**
 * Renders one account and its role and status actions.
 *
 * @param props - Account data, action state, and action handlers.
 * @returns An account table row.
 */
function AccountRow({
  account,
  isOwnAccount,
  isActionLoading,
  onRequestRoleChange,
  onRequestStatusChange,
}: AccountRowProps): ReactElement {
  const [selectedRole, setSelectedRole] = useState<UserRole>(account.role);

  useEffect(() => {
    setSelectedRole(account.role);
  }, [account.role]);

  const fullName = `${account.firstName} ${account.lastName}`;
  const nextStatus: AccountStatus = account.status === "active" ? "inactive" : "active";
  const statusAction = account.status === "active" ? "Deactivate" : "Activate";

  return (
    <tr className="border-t border-slate-200 align-top dark:border-neutral-800">
      <td className="px-4 py-4">
        <Avatar firstName={account.firstName} lastName={account.lastName} />
      </td>
      <td className="min-w-40 px-4 py-4 text-sm font-medium text-slate-900 dark:text-white">
        {fullName}
      </td>
      <td className="min-w-56 px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
        {account.email}
      </td>
      <td className="min-w-48 px-4 py-4 text-sm text-slate-700 dark:text-slate-200">
        {ROLE_LABELS[account.role]}
      </td>
      <td className="min-w-32 px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
        {account.phone}
      </td>
      <td className="px-4 py-4">
        <StatusBadge status={account.status} />
      </td>
      <td className="min-w-64 px-4 py-4">
        <div className="flex flex-col items-start gap-3">
          <div className="flex items-end gap-2">
            <RoleSelect
              disabled={isOwnAccount || isActionLoading}
              id={`role-${account.id}`}
              label={`Change role for ${fullName}`}
              onChange={(role) => {
                if (role) {
                  setSelectedRole(role);
                }
              }}
              value={selectedRole}
            />
            <button
              className="rounded-lg bg-teal-700 px-3 py-3 text-xs font-semibold text-white hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isOwnAccount || isActionLoading || selectedRole === account.role}
              onClick={() => onRequestRoleChange(account, selectedRole)}
              type="button"
            >
              Change role
            </button>
          </div>
          <button
            className="rounded text-sm font-semibold text-teal-800 underline underline-offset-4 hover:text-teal-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:text-slate-400 disabled:no-underline dark:text-teal-300 dark:hover:text-teal-100"
            disabled={isOwnAccount || isActionLoading}
            onClick={() => onRequestStatusChange(account, nextStatus)}
            type="button"
          >
            {statusAction}
          </button>
          {isOwnAccount && (
            <p className="max-w-56 text-xs text-slate-500 dark:text-slate-400">
              Your own role and account status cannot be changed.
            </p>
          )}
        </div>
      </td>
    </tr>
  );
}

export default AccountRow;
