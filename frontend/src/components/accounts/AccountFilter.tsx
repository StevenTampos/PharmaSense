import type { ReactElement } from "react";
import SelectField from "@/components/ui/SelectField";
import { ROLE_LABELS } from "@/lib/roles";
import type { AccountStatus, UserRole } from "@/types/account";

interface AccountFilterProps {
  isOpen: boolean;
  role: UserRole | "";
  status: AccountStatus | "";
  onRoleChange: (role: UserRole | "") => void;
  onStatusChange: (status: AccountStatus | "") => void;
  onClear: () => void;
  onToggle: () => void;
}

const ROLE_OPTIONS = [
  { value: "administrator", label: ROLE_LABELS.administrator },
  { value: "cashier_pharmacist", label: ROLE_LABELS.cashier_pharmacist },
  { value: "inventory_manager", label: ROLE_LABELS.inventory_manager },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

/**
 * Provides a compact role and status filter panel for the accounts list.
 *
 * @param props - Filter values and panel actions.
 * @returns The filter trigger and optional filter panel.
 */
function AccountFilter({
  isOpen,
  role,
  status,
  onRoleChange,
  onStatusChange,
  onClear,
  onToggle,
}: AccountFilterProps): ReactElement {
  return (
    <div className="relative">
      <button
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-slate-200 dark:hover:bg-neutral-800"
        onClick={onToggle}
        type="button"
      >
        <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 20 20">
          <path
            d="M3 4h14M5.5 10h9M8 16h4"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.6"
          />
        </svg>
        Filter
      </button>
      {isOpen && (
        <div className="absolute right-0 z-20 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-neutral-700 dark:bg-neutral-950">
          <div className="flex flex-col gap-4">
            <SelectField
              id="filter-role"
              label="Role"
              onChange={(event) => onRoleChange(event.target.value as UserRole | "")}
              options={ROLE_OPTIONS}
              placeholder="All roles"
              value={role}
            />
            <SelectField
              id="filter-status"
              label="Status"
              onChange={(event) => onStatusChange(event.target.value as AccountStatus | "")}
              options={STATUS_OPTIONS}
              placeholder="All statuses"
              value={status}
            />
            <button
              className="self-start rounded text-sm font-semibold text-teal-800 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:text-teal-300"
              onClick={onClear}
              type="button"
            >
              Clear filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountFilter;
