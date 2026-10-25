import type { ReactElement } from "react";
import { Navigate } from "react-router";
import BrandLogo from "@/components/layout/BrandLogo";
import UserMenu from "@/components/layout/UserMenu";
import { useAuth } from "@/hooks/useAuth";
import { getRoleLabel } from "@/lib/roles";
import { ROUTES } from "@/lib/routes";

interface AppHeaderProps {
  isSidebarOpen: boolean;
  onMenuClick: () => void;
}

/**
 * Renders the shared pharmacy header, greeting, navigation toggle, and user menu.
 *
 * @param props - Sidebar state and its toggle handler.
 * @returns The application header or a redirect for a signed-out user.
 */
function AppHeader({ isSidebarOpen, onMenuClick }: AppHeaderProps): ReactElement {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={ROUTES.login} replace />;
  }

  const greetingName =
    user.role === "administrator" ? getRoleLabel(user.role).slice(0, 5) : user.fullName;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto flex min-h-20 flex-wrap items-center justify-between gap-x-2 gap-y-1 px-4 py-3 sm:gap-4 lg:px-8">
        <div className="flex min-w-0 items-center gap-2">
          <button
            aria-controls="primary-navigation"
            aria-expanded={isSidebarOpen}
            aria-label={isSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:text-slate-200 dark:hover:bg-neutral-800 lg:hidden"
            onClick={onMenuClick}
            type="button"
          >
            <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
              {isSidebarOpen ? (
                <path
                  d="m6 6 12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.8"
                />
              ) : (
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.8"
                />
              )}
            </svg>
          </button>
          <div className="[&_img]:h-9 [&_img]:w-9 [&_span]:text-sm sm:[&_img]:h-12 sm:[&_img]:w-12 sm:[&_span]:text-lg">
            <BrandLogo />
          </div>
        </div>
        <div className="order-3 w-full pl-12 text-xs font-medium text-slate-600 dark:text-slate-300 md:order-none md:w-auto md:pl-0 md:text-sm">
          Welcome {greetingName}!
        </div>
        <UserMenu user={user} />
      </div>
    </header>
  );
}

export default AppHeader;
