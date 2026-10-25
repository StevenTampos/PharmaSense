import type { ReactElement } from "react";
import PlaceholderPanel from "@/components/dashboard/PlaceholderPanel";
import DashboardLayout from "@/components/layout/DashboardLayout";

/**
 * Composes the administrator dashboard and its forthcoming data panels.
 *
 * @returns The administrator dashboard page.
 */
function AdminDashboardPage(): ReactElement {
  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Administrator Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Your pharmacy workspace at a glance.
          </p>
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <PlaceholderPanel title="Analytics Dashboard" />
          <PlaceholderPanel title="Demand Ranking (Fast / Slow / Non-moving)" />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboardPage;
