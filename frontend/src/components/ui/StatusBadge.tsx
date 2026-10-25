import type { ReactElement } from "react";
import type { AccountStatus } from "@/types/account";

interface StatusBadgeProps {
  status: AccountStatus;
}

/**
 * Displays an account status with a color that remains paired with its text label.
 *
 * @param props - Account status.
 * @returns A status badge.
 */
function StatusBadge({ status }: StatusBadgeProps): ReactElement {
  const isActive = status === "active";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        isActive
          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
          : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

export default StatusBadge;
