import { Download, Eye, X } from "lucide-react";
import { useEffect, useState } from "react";
import { DataTable } from "./DataTable";

interface SubmissionManagerProps<T extends { id: string }> {
  title: string;
  load: () => Promise<T[]>;
  columns: { key: string; header: string; render?: (item: T) => React.ReactNode }[];
  statusOptions?: { value: string; label: string }[];
  onStatusChange?: (id: string, status: string) => Promise<unknown>;
  onNotesChange?: (id: string, notes: string) => Promise<unknown>;
  onDownload?: (item: T) => void;
  onError: (message: string) => void;
}

export function SubmissionManager<T extends { id: string }>({
  title,
  load,
  columns,
  statusOptions,
  onStatusChange,
  onNotesChange,
  onDownload,
  onError,
}: SubmissionManagerProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<T | null>(null);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  async function fetchItems() {
    setLoading(true);
    try {
      const data = await load();
      setItems(data);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to load submissions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (viewing && "notes" in viewing) {
      setNotes(String(viewing.notes ?? ""));
    } else {
      setNotes("");
    }
  }, [viewing]);

  async function saveNotes() {
    if (!viewing || !onNotesChange) return;
    setSavingNotes(true);
    try {
      await onNotesChange(viewing.id, notes);
      await fetchItems();
      setViewing((prev) => (prev ? ({ ...prev, notes } as T) : null));
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  }

  const actionColumn = {
    key: "actions",
    header: "Actions",
    render: (item: T) => (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setViewing(item)}
          className="p-1.5 text-slate-500 hover:text-primary hover:bg-primary/10 rounded transition"
        >
          <Eye className="h-4 w-4" />
        </button>
        {onDownload && (
          <button
            type="button"
            onClick={() => onDownload(item)}
            className="p-1.5 text-slate-500 hover:text-primary hover:bg-primary/10 rounded transition"
          >
            <Download className="h-4 w-4" />
          </button>
        )}
        {statusOptions && onStatusChange && (
          <select
            value={String((item as Record<string, unknown>).status ?? "")}
            onChange={async (e) => {
              try {
                await onStatusChange(item.id, e.target.value);
                await fetchItems();
              } catch (err) {
                onError(err instanceof Error ? err.message : "Failed to update status");
              }
            }}
            className="text-xs border border-slate-200 rounded px-2 py-1 focus:outline-none focus:border-primary"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
      </div>
    ),
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">{title}</h2>
      <DataTable columns={[...columns, actionColumn]} data={items} loading={loading} />

      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Submission Details</h3>
              <button
                type="button"
                onClick={() => setViewing(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {Object.entries(viewing).map(([key, value]) => {
                if (["id", "notes", "cv_url", "ip_address", "user_agent"].includes(key)) return null;
                return (
                  <div key={key}>
                    <p className="text-xs font-medium text-slate-500 uppercase">{key.replace(/_/g, " ")}</p>
                    <p className="text-sm text-slate-900 whitespace-pre-wrap">
                      {typeof (value as unknown) === "boolean"
                        ? (value ? "Yes" : "No")
                        : value === null
                          ? "—"
                          : String(value)}
                    </p>
                  </div>
                );
              })}
              {onNotesChange && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Admin Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={saveNotes}
                      disabled={savingNotes}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-60"
                    >
                      {savingNotes ? "Saving..." : "Save Notes"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
