import type { InputHTMLAttributes, ReactElement } from "react";

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  id: string;
  label: string;
}

/**
 * Renders a labeled text input.
 *
 * @param props - Input attributes, its ID, and its visible label.
 * @returns A labeled input element.
 */
function TextField({
  id,
  label,
  className,
  type = "text",
  ...props
}: TextFieldProps): ReactElement {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor={id}>
        {label}
      </label>
      <input
        className={`rounded-lg border border-slate-300 bg-white px-3 py-3 text-slate-900 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white ${className ?? ""}`}
        id={id}
        type={type}
        {...props}
      />
    </div>
  );
}

export default TextField;
