import type { ReactElement } from "react";

/**
 * Temporarily prevents the administrator login redirect from returning to the login page.
 * Chunk 2 replaces this placeholder with the administrator dashboard.
 *
 * @returns A temporary administrator dashboard placeholder.
 */
function AdminDashboardPage(): ReactElement {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center gap-3 px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
      <p className="text-slate-600 dark:text-slate-400">The full page is built in the next step.</p>
    </main>
  );
}

export default AdminDashboardPage;
