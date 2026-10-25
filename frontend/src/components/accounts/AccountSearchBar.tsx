import type { ReactElement } from "react";

interface AccountSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Renders the live account search control.
 *
 * @param props - Search value and change handler.
 * @returns A labeled search input.
 */
function AccountSearchBar({ value, onChange }: AccountSearchBarProps): ReactElement {
  return (
    <div className="w-full max-w-sm">
      <label className="sr-only" htmlFor="account-search">
        Search accounts
      </label>
      <div className="relative">
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.7" />
          <path d="m16 16 4.5 4.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
        </svg>
        <input
          className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm text-slate-900 outline-none focus-visible:border-teal-700 focus-visible:ring-2 focus-visible:ring-teal-700/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
          id="account-search"
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search accounts"
          type="search"
          value={value}
        />
      </div>
    </div>
  );
}

export default AccountSearchBar;
