import type { ButtonHTMLAttributes, ReactElement } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Renders the application's primary action button.
 *
 * @param props - Native button attributes and content.
 * @returns A styled button element.
 */
function Button({ children, className, type = "button", ...props }: ButtonProps): ReactElement {
  return (
    <button
      className={`w-full rounded-lg bg-teal-700 px-4 py-3 font-semibold text-white transition-colors hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-60 ${className ?? ""}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
