import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import type { Toast } from "@/hooks/use-toast";

export function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: string) => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white min-w-[300px] animate-in slide-in-from-right fade-in ${
            toast.type === "success"
              ? "bg-green-600"
              : toast.type === "error"
                ? "bg-red-600"
                : "bg-blue-600"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          ) : toast.type === "error" ? (
            <AlertCircle className="h-5 w-5 shrink-0" />
          ) : (
            <Info className="h-5 w-5 shrink-0" />
          )}
          <span className="flex-1 text-sm">{toast.message}</span>
          <button
            type="button"
            onClick={() => onRemove(toast.id)}
            className="p-1 hover:bg-white/20 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
