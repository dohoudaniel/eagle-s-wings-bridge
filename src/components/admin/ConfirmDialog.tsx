import { AlertTriangle } from "lucide-react";
import { Modal } from "./Modal";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal title={title} isOpen={isOpen} onClose={onCancel}>
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-red-100 rounded-full shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg font-medium text-white transition ${
              variant === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-primary hover:bg-primary/90"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
