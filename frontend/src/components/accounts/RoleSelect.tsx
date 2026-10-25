import type { ReactElement } from "react";
import SelectField from "@/components/ui/SelectField";
import { ROLE_LABELS } from "@/lib/roles";
import type { UserRole } from "@/types/account";

interface RoleSelectProps {
  id: string;
  value: UserRole | "";
  onChange: (role: UserRole | "") => void;
  label?: string;
  canChoosePlaceholder?: boolean;
  disabled?: boolean;
}

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "administrator", label: ROLE_LABELS.administrator },
  { value: "cashier_pharmacist", label: ROLE_LABELS.cashier_pharmacist },
  { value: "inventory_manager", label: ROLE_LABELS.inventory_manager },
];

/**
 * Renders the available PharmaSense account roles.
 *
 * @param props - Select value, label, disabled state, and change handler.
 * @returns A role select control.
 */
function RoleSelect({
  id,
  value,
  onChange,
  label = "Role",
  canChoosePlaceholder = false,
  disabled = false,
}: RoleSelectProps): ReactElement {
  return (
    <SelectField
      disabled={disabled}
      id={id}
      label={label}
      onChange={(event) => onChange(event.target.value as UserRole | "")}
      options={ROLE_OPTIONS}
      placeholder={canChoosePlaceholder ? "Choose role" : undefined}
      value={value}
    />
  );
}

export default RoleSelect;
