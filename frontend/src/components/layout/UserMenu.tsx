import { useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_LABELS } from "@/lib/roles";
import { ROUTES } from "@/lib/routes";
import type { AuthUser } from "@/types/auth";

interface UserMenuProps {
  user: AuthUser;
}

/**
 * Shows the signed-in user and provides an accessible logout menu.
 *
 * @param props - The current authenticated user.
 * @returns The user menu.
 */
function UserMenu({ user }: UserMenuProps): ReactElement {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const logoutRef = useRef<HTMLButtonElement>(null);
  const initials = user.fullName
    .split(" ")
    .map((namePart) => namePart.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent): void {
      const target = event.target;

      if (target instanceof Node && !menuRef.current?.contains(target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      logoutRef.current?.focus();
    }
  }, [isOpen]);

  function handleLogout(): void {
    logout();
    navigate(ROUTES.login, { replace: true });
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        aria-controls="user-menu"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={isOpen ? "Close user menu" : `Open user menu for ${user.fullName}`}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:hover:bg-neutral-800"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" && !isOpen) {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
        ref={triggerRef}
        type="button"
      >
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-900 dark:bg-teal-900 dark:text-teal-100"
        >
          {initials}
        </span>
        <span className="hidden min-w-0 sm:block">
          <span className="block max-w-36 truncate text-sm font-semibold text-slate-800 dark:text-white">
            {user.fullName}
          </span>
          <span className="block text-xs text-slate-500 dark:text-slate-400">
            {ROLE_LABELS[user.role]}
          </span>
        </span>
        <svg
          aria-hidden="true"
          className={`h-4 w-4 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            d="m5 7.5 5 5 5-5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
          />
        </svg>
      </button>
      {isOpen && (
        <div
          className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
          id="user-menu"
          role="menu"
        >
          <button
            className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-700 dark:text-slate-200 dark:hover:bg-neutral-800"
            onClick={handleLogout}
            ref={logoutRef}
            role="menuitem"
            type="button"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
