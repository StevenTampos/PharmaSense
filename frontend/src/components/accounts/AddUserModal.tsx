import { useState } from "react";
import type { ReactElement } from "react";
import AddUserForm from "@/components/accounts/AddUserForm";
import type { AddUserFormValues } from "@/components/accounts/AddUserForm";
import ConfirmDialog from "@/components/modal/ConfirmDialog";
import Modal from "@/components/modal/Modal";
import { useCountdown } from "@/hooks/useCountdown";
import type { NewAccountDetails } from "@/services/accountService";
import type { Account } from "@/types/account";
import type { ApiResponse } from "@/types/api";

interface AddUserModalProps {
  accounts: readonly Account[];
  isSubmitting: boolean;
  onAddAccount: (details: NewAccountDetails) => Promise<ApiResponse<Account>>;
  onClose: () => void;
}

const INITIAL_FORM_VALUES: AddUserFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "",
  password: "",
  confirmPassword: "",
};

/**
 * Collects a new account, confirms creation, and reports mock service failures.
 *
 * @param props - Current accounts, submit state, account action, and close handler.
 * @returns The add-account modal or its confirmation dialog.
 */
function AddUserModal({
  accounts,
  isSubmitting,
  onAddAccount,
  onClose,
}: AddUserModalProps): ReactElement {
  const [formValues, setFormValues] = useState<AddUserFormValues>(INITIAL_FORM_VALUES);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { countdown, startCountdown, cancelCountdown } = useCountdown(() => {
    setFormError(null);
  });
  const fullName = `${formValues.firstName.trim()} ${formValues.lastName.trim()}`.trim();

  function handleFormSubmit(values: AddUserFormValues): void {
    cancelCountdown();
    setFormError(null);
    setFormValues(values);
    setIsConfirmOpen(true);
  }

  function handleCancelConfirm(): void {
    setIsConfirmOpen(false);
  }

  async function handleConfirmAdd(): Promise<void> {
    if (!formValues.role) {
      return;
    }

    try {
      const response = await onAddAccount({
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email,
        phone: formValues.phone,
        role: formValues.role,
        password: formValues.password,
      });

      if (response.status === "success" && response.data) {
        onClose();
        return;
      }

      setIsConfirmOpen(false);
      if (response.message.includes("mock account service failed")) {
        setFormError(`Failed to add the user ${fullName}, please try again`);
        startCountdown();
      } else {
        setFormError(response.message);
      }
    } catch {
      setIsConfirmOpen(false);
      setFormError(`Failed to add the user ${fullName}, please try again`);
      startCountdown();
    }
  }

  if (isConfirmOpen) {
    return (
      <ConfirmDialog
        isConfirming={isSubmitting}
        message={`Are you sure you want to add ${fullName}?`}
        onCancel={handleCancelConfirm}
        onConfirm={() => {
          void handleConfirmAdd();
        }}
        title="Confirm new account"
      />
    );
  }

  return (
    <Modal title="Add user" onClose={onClose}>
      <AddUserForm
        countdown={countdown}
        errorMessage={formError}
        initialValues={formValues}
        isSubmitting={isSubmitting}
        onSubmit={handleFormSubmit}
        registeredEmails={accounts.map((account) => account.email)}
      />
    </Modal>
  );
}

export default AddUserModal;
