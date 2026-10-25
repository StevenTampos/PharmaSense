import { useState } from "react";
import type { InputHTMLAttributes, ReactElement } from "react";

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type"> {
  id: string;
  label: string;
  canToggleVisibility?: boolean;
}

/**
 * Renders a masked password field with an optional accessible visibility toggle.
 *
 * @param props - Input attributes, its ID, label, and toggle setting.
 * @returns A labeled password input.
 */
function PasswordField({
  id,
  label,
  className,
  canToggleVisibility = true,
  ...props
}: PasswordFieldProps): ReactElement {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <input
          className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-3 pr-20 text-slate-900 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white ${className ?? ""}`}
          id={id}
          type={isVisible && canToggleVisibility ? "text" : "password"}
          {...props}
        />
        {canToggleVisibility && (
          <button
            aria-label={isVisible ? "Hide password" : "Show password"}
            aria-pressed={isVisible}
            className="absolute inset-y-0 right-3 my-auto h-fit rounded text-sm font-medium text-teal-800 underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-teal-700 dark:text-teal-300"
            onClick={() => setIsVisible((currentVisibility) => !currentVisibility)}
            type="button"
          >
            {isVisible ? "Hide" : "Show"}
          </button>
        )}
      </div>
    </div>
  );
}

export default PasswordField;
