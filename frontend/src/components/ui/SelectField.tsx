import type { ReactElement, SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> {
  id: string;
  label: string;
  options: readonly SelectOption[];
  placeholder?: string;
}

/**
 * Renders a labeled select control with optional placeholder text.
 *
 * @param props - Select attributes, label, options, and placeholder.
 * @returns A labeled select element.
 */
function SelectField({
  id,
  label,
  options,
  placeholder,
  className,
  ...props
}: SelectFieldProps): ReactElement {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor={id}>
        {label}
      </label>
      <select
        className={`rounded-lg border border-slate-300 bg-white px-3 py-3 text-slate-900 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white ${className ?? ""}`}
        id={id}
        {...props}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectField;
