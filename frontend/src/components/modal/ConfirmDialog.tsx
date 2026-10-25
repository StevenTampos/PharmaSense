import type { ReactElement } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/modal/Modal";

interface ConfirmDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isConfirming?: boolean;
}

/**
 * Asks the user to confirm or cancel a consequential action.
 *
 * @param props - Dialog text, action handlers, and pending state.
 * @returns A confirmation dialog with YES and NO actions.
 */
function ConfirmDialog({
  title,
  message,
  onConfirm,
  onCancel,
  isConfirming = false,
}: ConfirmDialogProps): ReactElement {
  function handleClose(): void {
    if (!isConfirming) {
      onCancel();
    }
  }

  return (
    <Modal
      canCloseOnOverlayClick={!isConfirming}
      isCloseDisabled={isConfirming}
      onClose={handleClose}
      title={title}
    >
      <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{message}</p>
      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:opacity-60 dark:border-neutral-700 dark:text-slate-200 dark:hover:bg-neutral-900"
          disabled={isConfirming}
          onClick={onCancel}
          type="button"
        >
          NO
        </button>
        <Button className="w-full sm:w-auto" disabled={isConfirming} onClick={onConfirm}>
          {isConfirming ? "Please wait..." : "YES"}
        </Button>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
