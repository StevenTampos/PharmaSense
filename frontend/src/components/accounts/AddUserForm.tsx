import { useState } from "react";
import type { FormEvent, ReactElement } from "react";
import PasswordField from "@/components/ui/PasswordField";
import TextField from "@/components/ui/TextField";
import RoleSelect from "@/components/accounts/RoleSelect";
import { isDigitsOnlyPhone, isRequired, isValidEmail, passwordsMatch } from "@/lib/validators";
import type { UserRole } from "@/types/account";

export interface AddUserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole | "";
  password: string;
  confirmPassword: string;
}

interface AddUserFormProps {
  registeredEmails: readonly string[];
  initialValues: AddUserFormValues;
  errorMessage: string | null;
  countdown: number | null;
  isSubmitting: boolean;
  onSubmit: (values: AddUserFormValues) => void;
}

type FormField = keyof AddUserFormValues;
type FormErrors = Partial<Record<FormField, string>>;

/**
 * Collects and validates the required fields for a new account.
 *
 * @param props - Existing email addresses, initial values, state, and submit handler.
 * @returns A validated new-account form.
 */
function AddUserForm({
  registeredEmails,
  initialValues,
  errorMessage,
  countdown,
  isSubmitting,
  onSubmit,
}: AddUserFormProps): ReactElement {
  const [values, setValues] = useState<AddUserFormValues>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  function updateValue(field: FormField, value: string): void {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
    setFieldErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const errors: FormErrors = {};

    if (!isRequired(values.firstName)) {
      errors.firstName = "First name is required.";
    }
    if (!isRequired(values.lastName)) {
      errors.lastName = "Last name is required.";
    }
    if (!isRequired(values.email)) {
      errors.email = "Email is required.";
    } else if (!isValidEmail(values.email)) {
      errors.email = "Enter a valid email address.";
    } else if (
      registeredEmails.some((email) => email.toLowerCase() === values.email.trim().toLowerCase())
    ) {
      errors.email = "An account with this email is already registered.";
    }
    if (!isRequired(values.phone)) {
      errors.phone = "Phone number is required.";
    } else if (!isDigitsOnlyPhone(values.phone)) {
      errors.phone = "Phone number must contain digits only.";
    }
    if (!values.role) {
      errors.role = "Choose a role.";
    }
    if (!isRequired(values.password)) {
      errors.password = "Password is required.";
    }
    if (!isRequired(values.confirmPassword)) {
      errors.confirmPassword = "Confirm password is required.";
    } else if (!passwordsMatch(values.password, values.confirmPassword)) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length === 0) {
      onSubmit(values);
    }
  }

  return (
    <form className="flex flex-col gap-4" noValidate onSubmit={handleSubmit}>
      {errorMessage && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {errorMessage}
          {countdown !== null && <span className="ml-2">Dismisses in {countdown}...</span>}
        </div>
      )}
      <TextField
        autoComplete="given-name"
        id="new-first-name"
        label="First Name"
        onChange={(event) => updateValue("firstName", event.target.value)}
        placeholder="Enter first name"
        value={values.firstName}
      />
      {fieldErrors.firstName && <FieldError>{fieldErrors.firstName}</FieldError>}
      <TextField
        autoComplete="family-name"
        id="new-last-name"
        label="Last Name"
        onChange={(event) => updateValue("lastName", event.target.value)}
        placeholder="Enter last name"
        value={values.lastName}
      />
      {fieldErrors.lastName && <FieldError>{fieldErrors.lastName}</FieldError>}
      <TextField
        autoComplete="email"
        id="new-email"
        label="Email"
        onChange={(event) => updateValue("email", event.target.value)}
        placeholder="Enter email"
        type="email"
        value={values.email}
      />
      {fieldErrors.email && <FieldError>{fieldErrors.email}</FieldError>}
      <TextField
        autoComplete="tel"
        id="new-phone"
        inputMode="numeric"
        label="Phone Number"
        onChange={(event) => updateValue("phone", event.target.value)}
        placeholder="Enter number"
        type="tel"
        value={values.phone}
      />
      {fieldErrors.phone && <FieldError>{fieldErrors.phone}</FieldError>}
      <RoleSelect
        canChoosePlaceholder
        id="new-role"
        onChange={(role) => updateValue("role", role)}
        value={values.role}
      />
      {fieldErrors.role && <FieldError>{fieldErrors.role}</FieldError>}
      <PasswordField
        autoComplete="new-password"
        canToggleVisibility={false}
        id="new-password"
        label="Password"
        onChange={(event) => updateValue("password", event.target.value)}
        placeholder="Enter password"
        value={values.password}
      />
      {fieldErrors.password && <FieldError>{fieldErrors.password}</FieldError>}
      <PasswordField
        autoComplete="new-password"
        canToggleVisibility={false}
        id="confirm-password"
        label="Confirm Password"
        onChange={(event) => updateValue("confirmPassword", event.target.value)}
        placeholder="Confirm password"
        value={values.confirmPassword}
      />
      {fieldErrors.confirmPassword && <FieldError>{fieldErrors.confirmPassword}</FieldError>}
      <button
        className="mt-2 w-full rounded-lg bg-teal-700 px-4 py-3 font-semibold text-white transition-colors hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        Add user
      </button>
    </form>
  );
}

interface FieldErrorProps {
  children: string;
}

function FieldError({ children }: FieldErrorProps): ReactElement {
  return (
    <p className="text-sm text-red-700 dark:text-red-300" role="alert">
      {children}
    </p>
  );
}

export default AddUserForm;
