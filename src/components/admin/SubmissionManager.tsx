import { Download, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { DataTable } from "./DataTable";

interface SubmissionManagerProps<T extends { id: string }> {
  title: string;
  load: () => Promise<T[]>;
  columns: { key: string; header: string; render?: (item: T) => React.ReactNode }[];
  statusOptions?: { value: string; label: string }[];
  onStatusChange?: (id: string, status: string) => Promise<unknown>;
  onView?: (item: T) => void;
  onDownload?: (item: T) => void;
  onError: (message: string) => void;
}

export function SubmissionManager<T extends { id: string }>({
  title,
  load,
  columns,
  statusOptions,
  onStatusChange,
  onView,
  onDownload,
  onError,
}: SubmissionManagerProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

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

  const actionColumn = {
    key: "actions",
    header: "Actions",
    render: (item: T) => (
      <div className="flex items-center gap-2">
        {onView && (
          <button
            type="button"
            onClick={() => onView(item)}
            className="p-1.5 text-slate-500 hover:text-primary hover:bg-primary/10 rounded transition"
          >
            <Eye className="h-4 w-4" />
          </button>
        )}
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
    </div>
  );
}
