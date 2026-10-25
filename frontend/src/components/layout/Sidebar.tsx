import type { ReactElement } from "react";
import { NavLink } from "react-router";
import { ADMIN_NAVIGATION } from "@/lib/adminNavigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Renders the responsive, data-driven application navigation.
 *
 * @param props - Drawer visibility and its close handler.
 * @returns The navigation drawer and sidebar.
 */
function Sidebar({ isOpen, onClose }: SidebarProps): ReactElement {
  return (
    <>
      {isOpen && (
        <button
          aria-label="Close navigation menu"
          className="fixed inset-x-0 bottom-0 top-28 z-30 bg-slate-950/40 md:top-20 lg:hidden"
          onClick={onClose}
          type="button"
        />
      )}
      <aside
        className={`fixed bottom-0 left-0 top-28 z-40 w-72 overflow-y-auto border-r border-slate-200 bg-white px-4 py-6 shadow-xl dark:border-neutral-800 dark:bg-neutral-950 md:top-20 lg:sticky lg:top-20 lg:z-auto lg:block lg:h-[calc(100vh-5rem)] lg:shrink-0 lg:shadow-none ${
          isOpen ? "block" : "hidden"
        }`}
        id="primary-navigation"
      >
        <nav aria-label="Primary navigation">
          <ul className="flex flex-col gap-1">
            {ADMIN_NAVIGATION.map((item) => (
              <li key={item.label}>
                {item.isAvailable ? (
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? "flex items-center gap-3 rounded-lg bg-teal-50 px-3 py-3 text-sm font-semibold text-teal-900 dark:bg-teal-950/60 dark:text-teal-100"
                        : "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:text-slate-200 dark:hover:bg-neutral-800"
                    }
                    end
                    onClick={onClose}
                    to={item.path}
                  >
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 rounded-full bg-current opacity-70"
                    />
                    {item.label}
                  </NavLink>
                ) : (
                  <div
                    aria-disabled="true"
                    className="flex min-h-11 items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 dark:text-neutral-500"
                  >
                    <span className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="h-2 w-2 rounded-full bg-current opacity-50"
                      />
                      {item.label}
                    </span>
                    <span className="shrink-0 text-[0.65rem] font-medium uppercase tracking-wide">
                      Coming soon
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
