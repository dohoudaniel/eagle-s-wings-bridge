import { Pencil, Trash2 } from "lucide-react";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  keyField = "id",
  onEdit,
  onDelete,
  loading,
}: {
  columns: Column<T>[];
  data: T[];
  keyField?: string;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-8 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 bg-slate-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <p className="text-slate-500">No items yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-medium">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3">
                  {col.header}
                </th>
              ))}
              {(onEdit || onDelete) && <th className="px-4 py-3 w-24">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item) => (
              <tr key={String((item as Record<string, unknown>)[keyField])} className="hover:bg-slate-50/50">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? "-")}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          className="p-1.5 text-slate-500 hover:text-primary hover:bg-primary/10 rounded transition"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(item)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
