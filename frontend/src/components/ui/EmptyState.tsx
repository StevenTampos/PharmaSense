import type { ReactElement, ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

/**
 * Shows a centered message when a content area has no items.
 *
 * @param props - State title and optional description or action.
 * @returns An empty-state panel.
 */
function EmptyState({ title, description, children }: EmptyStateProps): ReactElement {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-2 px-6 py-10 text-center">
      <h2 className="text-base font-semibold text-slate-800 dark:text-white">{title}</h2>
      {description && (
        <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">{description}</p>
      )}
      {children}
    </div>
  );
}

export default EmptyState;
