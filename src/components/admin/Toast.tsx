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
    <div className="fixed right-4 top-4 z-[60] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex min-w-[300px] items-center gap-3 rounded-xl px-4 py-3 text-white shadow-elegant animate-in fade-in slide-in-from-right ${
            toast.type === "success"
              ? "bg-success"
              : toast.type === "error"
                ? "bg-destructive"
                : "bg-primary"
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
            className="rounded p-1 hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
