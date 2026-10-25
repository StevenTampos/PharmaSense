import type { ReactElement } from "react";

interface PlaceholderPanelProps {
  title: string;
}

/**
 * Shows a titled, empty panel for dashboard data that is not implemented yet.
 *
 * @param props - The panel's visible title.
 * @returns An empty-state dashboard panel.
 */
function PlaceholderPanel({ title }: PlaceholderPanelProps): ReactElement {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 sm:p-8">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
      <div className="mt-6 flex min-h-48 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center dark:border-neutral-700 dark:bg-neutral-900">
        <p className="max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
          Data will be available here later.
        </p>
      </div>
    </section>
  );
}

export default PlaceholderPanel;
