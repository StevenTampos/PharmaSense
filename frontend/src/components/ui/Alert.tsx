import type { ReactElement, ReactNode } from "react";

interface AlertProps {
  children: ReactNode;
}

/**
 * Announces an important message to assistive technology.
 *
 * @param props - Alert message content.
 * @returns An accessible alert region.
 */
function Alert({ children }: AlertProps): ReactElement {
  return (
    <div
      className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
      role="alert"
    >
      {children}
    </div>
  );
}

export default Alert;
