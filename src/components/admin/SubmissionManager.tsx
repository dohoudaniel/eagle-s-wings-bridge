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
          className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
        >
          <Eye className="h-4 w-4" />
        </button>
        {onDownload && (
          <button
            type="button"
            onClick={() => onDownload(item)}
            className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
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
            className="rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
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
      <h2 className="mb-8 font-display text-3xl font-bold text-foreground">{title}</h2>
      <DataTable columns={[...columns, actionColumn]} data={items} loading={loading} />

      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card shadow-elegant">
            <div className="flex items-center justify-between border-b border-border p-6">
              <h3 className="font-display text-lg font-bold text-foreground">Submission Details</h3>
              <button
                type="button"
                onClick={() => setViewing(null)}
                aria-label="Close"
                className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 p-6">
              {Object.entries(viewing).map(([key, value]) => {
                if (["id", "notes", "cv_url", "ip_address", "user_agent"].includes(key))
                  return null;
                return (
                  <div key={key}>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {key.replace(/_/g, " ")}
                    </p>
                    <p className="mt-0.5 whitespace-pre-wrap text-sm text-foreground">
                      {typeof (value as unknown) === "boolean"
                        ? value
                          ? "Yes"
                          : "No"
                        : value === null
                          ? "—"
                          : String(value)}
                    </p>
                  </div>
                );
              })}
              {onNotesChange && (
                <div className="border-t border-border pt-4">
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Admin Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                  />
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={saveNotes}
                      disabled={savingNotes}
                      className="rounded-xl bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-soft transition hover:shadow-glow disabled:opacity-60"
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
