import type { ReactElement } from "react";
import { Navigate } from "react-router";
import LoginForm from "@/components/auth/LoginForm";
import BrandLogo from "@/components/layout/BrandLogo";
import { getHomePathForRole, hasBuiltDashboard } from "@/lib/roles";
import { useAuth } from "@/hooks/useAuth";

/**
 * Composes the login screen and redirects authenticated users to a built dashboard.
 *
 * @returns The login page or an authenticated-user redirect.
 */
function LoginPage(): ReactElement {
  const { user } = useAuth();

  if (user && hasBuiltDashboard(user.role)) {
    return <Navigate to={getHomePathForRole(user.role)} replace />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 dark:bg-neutral-950">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5 dark:border-neutral-800 dark:bg-neutral-900 sm:p-10">
        <div className="mb-8 flex flex-col items-center gap-5 text-center">
          <BrandLogo />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              PharmaSense Portal
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Sign in to continue to your workspace.
            </p>
          </div>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}

export default LoginPage;
